"use strict";

import _templates from "../_templates.js";
import CooldownsManager from "./CooldownsManager.js";
import Time from "./Time.js";

export default class Game {
	constructor({ player, ui, saveManager }) {
		this.player = player;
		this.ui = ui;
		this.saveManager = saveManager;

		this.time = new Time({ time: this.player.time });

		this.worldObjects = [];
		this.selectedWorldObject = null;

		this.cooldowns = new CooldownsManager();
	}

	init() {
		this.initWorldObjectEvents();

		this.initInventoryEvents();

		this.initPlayerUI();

		this.initTime();
	}

	initTime() {
		if (this.timeInterval) clearInterval(this.timeInterval);

		const updateTimeUI = () => {
			const { min, hour, day } = this.time.getFormattedTime();

			const minStr = String(min).padStart(2, "0");
			const hourStr = String(hour).padStart(2, "0");

			this.ui.updateWorldInfoTime(`${hourStr}:${minStr}`);
			this.ui.updateWorldInfoDay(day);
		};
		updateTimeUI();

		this.timeInterval = setInterval(() => {
			this.player.time = this.time.elapseTime();

			updateTimeUI();

			// OTHER PLAYER EVENTS
			if (this.time.checkFullHour() && this.player.energy !== 100) {
				this.handlePlayerRestoreEnergy();
			}

			this.saveManager.save(this.player);
		}, 1 * 1000);
	}

	initPlayerUI() {
		this.ui.updateCharacterName(this.player.name);

		this.ui.updateCharacterClass(this.player.level);

		this.updatePlayerUI();

		for (const { item } of this.player.inventory.items) {
			this.updateInventoryUI(item);
		}

		for (const tool of this.player.inventory.equippedTools.values()) {
			this.ui.updateToolEquippedState(tool.itemCode, true);
		}

		for (const [currency, amount] of this.player.currencies.entries()) {
			const currencyObj = Object.values(_templates).find(
				(el) => el.name.toLowerCase() === currency,
			);
			currencyObj.amount = amount;

			this.ui.addPlayerCurrency(currencyObj);
		}
	}

	initWorldObjectEvents() {
		this.ui.worldObjectsContainer.addEventListener("click", (e) => {
			const element = e.target.closest(".world-object");

			if (!element) return;

			const worldObjectCode = element.dataset.worldObject;

			const worldObject = this.getWorldObject(worldObjectCode);

			if (!worldObject) return;

			this.selectWorldObject(worldObject);
		});
	}

	initInventoryEvents() {
		this.ui.inventoryList.addEventListener("click", async (e) => {
			const element = e.target.closest(".inventory-item");

			if (!element) return;

			const itemCode = element.dataset.itemCode;

			const inventoryItem = this.player.inventory.findItem(itemCode);

			if (!inventoryItem) return;

			const item = inventoryItem.item;

			const actionCode = await this.ui.renderActionWheel(item.getActions());

			if (!item || !actionCode) return;
			this.executeActionInventoryItem(actionCode, item);
		});
	}

	addWorldObject(worldObject) {
		const exists = this.getWorldObject(worldObject.worldObject);

		if (exists) {
			return false;
		}

		this.worldObjects.push(worldObject);

		this.ui.addWorldObject(worldObject);

		return true;
	}

	removeWorldObject(worldObjectCode) {
		const worldObject = this.getWorldObject(worldObjectCode);

		if (!worldObject) {
			return false;
		}

		const indexInWorldObjectsArray = this.worldObjects.findIndex(
			(wo) => wo.worldObject === worldObject.worldObject,
		);

		if (indexInWorldObjectsArray !== -1) {
			this.worldObjects.splice(indexInWorldObjectsArray, 1);
		}

		this.ui.removeWorldObject(worldObjectCode);

		return true;
	}

	getWorldObject(worldObjectCode) {
		return this.worldObjects.find(
			(worldObject) => worldObject.worldObject === worldObjectCode,
		);
	}

	startResourceRespawn(resourceNode) {
		const cooldownCode = `${resourceNode.worldObject}-respawn`;

		let countdownInterval = null;

		const started = this.cooldowns.add(
			cooldownCode,
			resourceNode.restoreCooldown,
			() => {
				clearInterval(countdownInterval);

				resourceNode.restore();

				this.updateResourceNodeUI(resourceNode);

				this.ui.sendSystemMessage(
					`${resourceNode.name} este din nou disponibil.`,
				);
			},
		);

		if (!started) {
			return false;
		}

		const updateCountdown = () => {
			const remainingTime = this.cooldowns.getRemainingTime(cooldownCode);

			const seconds = Math.ceil(remainingTime);

			this.ui.updateWorldObjectStatus(
				resourceNode.worldObject,
				`${seconds}s`,
			);
		};

		updateCountdown();

		countdownInterval = setInterval(updateCountdown, 250);

		return true;
	}

	async selectWorldObject(worldObject) {
		this.selectedWorldObject = worldObject;

		const selectedActionCode = await this.ui.renderActionWheel(
			worldObject.getActions(),
		);

		if (!selectedActionCode) {
			this.selectedWorldObject = null;

			return;
		}

		const action = worldObject.getAction(selectedActionCode);

		if (!action) {
			this.selectedWorldObject = null;

			return;
		}

		this.executeActionWorldObject(action, worldObject);

		this.selectedWorldObject = null;
	}

	executeActionWorldObject(action, worldObject) {
		switch (action.type) {
			case "harvest":
				this.executeHarvestAction(action, worldObject);

				break;

			case "inspect":
				this.executeInspectAction(worldObject);

				break;

			case "collect":
				this.executeCollectAction(worldObject);

				break;

			default:
				console.error(`Unknown action type: ${action.type}`);
		}
	}

	executeActionInventoryItem(action, inventoryItem) {
		switch (action) {
			case "inspect":
				this.executeInspectAction(inventoryItem);

				break;

			case "toggleEquip":
				this.toggleTool(inventoryItem);

				break;

			case "drop":
				this.player.inventory.dropItem(inventoryItem);

				this.ui.removeInventoryItem(inventoryItem.itemCode);

				this.saveManager.save(this.player);

				break;

			default:
				console.error(`Unknown action type: ${action.type}`);
		}
	}

	executeHarvestAction(action, resourceNode) {
		if (resourceNode.isDepleted()) {
			this.ui.sendSystemMessage(
				`${resourceNode.name} nu are resurse de colectat momentan.`,
			);

			return;
		}

		const requiredTool = resourceNode.requiredTool;
		const tool = this.player.inventory.equippedTools.get(requiredTool);

		if (!tool) {
			this.ui.sendSystemMessage(
				`Ai nevoie de un tool de tip ${requiredTool} echipat pentru această acțiune.`,
			);

			return;
		}

		if (tool.isBroken()) {
			this.ui.sendSystemMessage(
				"Unealta echipată este stricată și nu poate fi folosită.",
			);

			return;
		}

		if (!tool.hasRequiredDurability(1)) {
			this.ui.sendSystemMessage(
				"Unealta echipată este stricată și nu poate fi folosită.",
			);

			return;
		}

		const energyUsed = this.player.useEnergy(action.energyCost);

		if (!energyUsed) {
			this.ui.sendSystemMessage(
				"Nu ai suficientă energie pentru această actiune.",
			);

			return;
		}

		tool.use();
		this.ui.updateToolDurability(tool);

		const harvestedAmount = resourceNode.harvest(
			resourceNode.harvestAmount * tool.efficiency,
		);

		this.player.inventory.addItem(resourceNode.resource, harvestedAmount);

		this.player.addXP(resourceNode.xpReward);

		this.updatePlayerUI();

		this.updateResourceNodeUI(resourceNode);

		this.updateInventoryUI(resourceNode.resource);

		this.renderPlayerCurrencyUI();

		this.ui.sendNarratorMessage(
			`Ai colectat ${harvestedAmount} ${resourceNode.resource.name} din ${resourceNode.name}.`,
		);

		this.ui.sendSystemMessage(
			`-${action.energyCost} Energy • +${resourceNode.xpReward} XP`,
		);

		if (resourceNode.isDepleted()) {
			this.startResourceRespawn(resourceNode);
		}

		this.saveManager.save(this.player);
	}

	executeInspectAction(element) {
		console.log(element);
		// Inspect in functie de world object sau item in inventar
		if (element.worldObject) {
			this.ui.sendNarratorMessage(
				`${element.description}
				${element.currentAmount} / ${element.maxAmount} resurse ramase`,
			);

			return;
		}

		if (element.type === "tool") {
			this.ui.sendNarratorMessage(
				`${element.description} Durability: ${element.durability} / ${element.maxDurability}`,
			);

			return;
		}

		if (element.itemCode) {
			this.ui.sendNarratorMessage(
				`${element.description} x${this.player.inventory.findItem(element.itemCode).amount}`,
			);
		}
	}

	executeCollectAction(worldObject) {
		if (!worldObject.collectables.size) return;

		let collected = "";
		for (const [amount, item] of worldObject.collectables.entries()) {
			if (item.itemCode.includes("currency")) {
				this.player.addCurrency(item.name.toLowerCase(), amount);

				const currencyObj = _templates.currencyGold;
				currencyObj.amount = this.player.currencies.get(
					item.name.toLowerCase(),
				);

				this.updatePlayerCurrencyUI(currencyObj);
			} else {
				this.player.inventory.addItem(item, amount);

				this.updateInventoryUI(item);
			}

			collected += `${item.name}: ${amount} & `;
		}

		this.ui.sendNarratorMessage(`Ai colectat: ${collected}`.slice(0, -3));
		this.saveManager.save(this.player);

		// Remove if collectOnce is true
		if (worldObject.collectOnce) {
			this.removeWorldObject(worldObject.worldObject);
		}

		this.player.redeemedStarter = true;

		this.saveManager.save(this.player);
	}

	updatePlayerUI() {
		this.ui.updateHealth(this.player.health);

		this.ui.updateEnergy(this.player.energy, this.player.maxEnergy);

		this.ui.updateXP(this.player.xp, this.player.maxXP);

		this.ui.updateLevel(this.player.level);
	}

	updateResourceNodeUI(resourceNode) {
		this.ui.editWorldObject(resourceNode.worldObject, resourceNode);
	}

	updatePlayerCurrencyUI(currencyObj) {
		if (this.ui.checkHasCurrency(currencyObj.itemCode)) {
			this.ui.editPlayerCurrency(currencyObj);

			return;
		}

		this.ui.addPlayerCurrency(currencyObj);
	}

	renderPlayerCurrencyUI() {
		this.ui.currencyContainer.innerHTML = "";

		for (const [currency, amount] of this.player.currencies.entries()) {
			const currencyObj = Object.values(_templates).find(
				(el) => el.name.toLowerCase() === currency,
			);
			currencyObj.amount = amount;

			this.ui.addPlayerCurrency(currencyObj);
		}
	}

	updateInventoryUI(item) {
		const inventoryItem = this.player.inventory.findItem(item.itemCode);

		if (!inventoryItem) {
			return;
		}

		const uiItem = {
			itemCode: item.itemCode,

			description: item.description,

			resource: {
				name: item.name,

				icon: item.icon,

				amount: inventoryItem.amount,
			},
		};

		if (item.type === "tool") {
			uiItem.type = "tool";
			uiItem.durability = item.durability;
			uiItem.maxDurability = item.maxDurability;
		}

		if (this.ui.hasInventoryItem(item.itemCode)) {
			this.ui.editInventoryItem(uiItem);

			return;
		}

		this.ui.setInventoryItemCount(
			this.player.inventory.items.length,
			this.player.inventory.maxItemCount,
		);
		this.ui.addInventoryItem(uiItem);
	}

	toggleTool(tool) {
		const previouslyEquipped = this.player.inventory.equippedTools.get(
			tool.toolType,
		);

		const equipped = this.player.inventory.toggleTool(tool);

		if (previouslyEquipped && previouslyEquipped !== tool) {
			this.ui.updateToolEquippedState(previouslyEquipped.itemCode, false);
		}

		this.ui.updateToolEquippedState(tool.itemCode, equipped);
		this.saveManager.save(this.player);

		if (equipped) {
			this.ui.sendSystemMessage(`${tool.name} a fost echipat.`);

			return;
		}

		this.ui.sendSystemMessage(`${tool.name} a fost dezechipat.`);
	}

	handlePlayerRestoreEnergy() {
		// RESTORE 5 ENERGY POINTS
		const addedEnergy = 5;

		this.player.restoreEnergy(addedEnergy);

		this.ui.updateEnergy(this.player.energy);
	}
}
