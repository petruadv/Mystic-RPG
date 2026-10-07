"use strict";

import CooldownsManager from "./CooldownsManager.js";

export default class Game {
	constructor({ player, ui }) {
		this.player = player;
		this.ui = ui;

		this.worldObjects = [];
		this.selectedWorldObject = null;

		this.cooldowns = new CooldownsManager();
	}

	init() {
		this.initWorldObjectEvents();

		this.initPlayerUI();
	}

	initPlayerUI() {
		this.ui.updateCharacterName(this.player.name);

		this.ui.updateCharacterClass(this.player.level);

		this.updatePlayerUI();
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

		this.worldObjects = this.worldObjects.filter(
			(worldObject) => worldObject.worldObject !== worldObjectCode,
		);

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

		this.executeAction(action, worldObject);

		this.selectedWorldObject = null;
	}

	executeAction(action, worldObject) {
		switch (action.type) {
			case "harvest":
				this.executeHarvestAction(action, worldObject);

				break;

			case "inspect":
				this.executeInspectAction(action, worldObject);

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

		const energyUsed = this.player.useEnergy(action.energyCost);

		if (!energyUsed) {
			this.ui.sendSystemMessage(
				"Nu ai suficienta energie pentru aceasta actiune.",
			);

			return;
		}

		const harvestedAmount = resourceNode.harvest(resourceNode.harvestAmount);

		if (harvestedAmount <= 0) {
			this.ui.sendSystemMessage(
				`${resourceNode.name} nu mai are resurse disponibile.`,
			);

			return;
		}

		this.player.inventory.addItem(resourceNode.resource, harvestedAmount);

		this.player.addXP(resourceNode.xpReward);

		this.updatePlayerUI();

		this.updateResourceNodeUI(resourceNode);

		this.updateInventoryUI(resourceNode.resource);

		this.ui.sendNarratorMessage(
			`Ai colectat ${harvestedAmount} ${resourceNode.resource.name} din ${resourceNode.name}.`,
		);

		this.ui.sendSystemMessage(
			`-${action.energyCost} Energy • +${resourceNode.xpReward} XP`,
		);

		if (resourceNode.isDepleted()) {
			this.startResourceRespawn(resourceNode);
		}
	}

	executeInspectAction(_, worldObject) {
		this.ui.sendNarratorMessage(worldObject.description);
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

		if (this.ui.hasInventoryItem(item.itemCode)) {
			this.ui.editInventoryItem(uiItem);

			return;
		}

		this.ui.addInventoryItem(uiItem);
	}
}
