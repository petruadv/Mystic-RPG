"use strict";

export default class UI {
	static calcPercent(currentValue, maxValue) {
		return Number((currentValue / maxValue) * 100).toFixed(2);
	}

	static getElementByItemCode(container, itemCode) {
		// assigning container to not search on the whole document
		return container.querySelector(`[data-item-code='${itemCode}']`);
	}

	constructor() {
		//          [CHARACTER NAME]
		this.characterName = document.getElementById("characterName");

		//          [CHARACTER CLASS]
		// EX: MYSTIC SETTLER la nivel 1
		this.characterClass = document.getElementById("characterClass");

		//          [HEALTH]
		// Health Percent (100 / 100)
		this.healthPercent = document.getElementById("healthPercent");
		// Health Progress Bar
		this.healthProgressBar = document.getElementById("healthProgress");

		//          [ENERGY]
		// Energy Percent (100 / 100)
		this.energyPercent = document.getElementById("energyPercent");
		// Energy Progress Bar
		this.energyProgressBar = document.getElementById("energyProgress");

		//          [EXPERIENCE]
		// XP Points (100 / 100)
		this.xpPoints = document.getElementById("xpPoints");
		// XP Progress Bar
		this.xpProgressBar = document.getElementById("xpProgress");
		// Level Badge
		this.levelBadge = document.getElementById("levelBadge");

		//           [WORLD DATA]
		// CURRENT WORLD DAY
		this.worldInfoDay = document.getElementById("worldInfoDay");
		// CURRENT WORLD TIME
		this.worldInfoTime = document.getElementById("worldInfoTime");
		// FARM STATUS
		this.farmStatus = document.getElementById("farmStatus");
		// CURRENT AREA
		this.currentArea = document.getElementById("currentArea");
		// CURRENT LAND
		this.currentLand = document.getElementById("currentLand");
		// LAND DESCRIPTION
		this.landDescription = document.getElementById("landDescription");
		// WORLD OBJECTS CONTAINER
		this.worldObjectsContainer = document.getElementById(
			"worldObjectsContainer",
		);

		//          [GAME LOG CHAT]
		this.gameLogMessages = document.getElementById("gameLogMessages");

		//          [INVENTORY & RIGHT BAR]
		// INVENTORY WEIGHT
		this.inventoryWeight = document.getElementById("inventoryWeight");
		// CURRENCY CONTAINER
		this.currencyContainer = document.getElementById("currencyContainer");
		// INVENTORY LIST
		this.inventoryList = document.getElementById("inventoryList");

		// 			[ACTION WHEEL OVERLAY]
		// ACTION WHEEL OVERLAY
		this.actionWheelOverlay = document.getElementById("actionWheelOverlay");
		// ACTION WHEEL
		this.actionWheel = document.getElementById("actionWheel");
		// ACTION WHEEL CANCEL BUTTON
		this.actionWheelCancel = document.getElementById("actionWheelCancel");
	}

	// API \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/

	// --------------------- CHARACTER STATS

	// UPDATE CHARACTER NAME
	updateCharacterName(characterName) {
		this.characterName.textContent = characterName;
	}

	// UPDATE CHARACTER CLASS
	updateCharacterClass(level) {
		if (level <= 5) {
			this.characterClass.textContent = `MYSTIC SETTLER`;
			return;
		} else {
			this.characterClass.textContent = "undefined yet";
			// TODO: sa definesc clase pana la un anumit nivel in functie de nivel sau idk yet
		}
	}

	// UPDATE HEALTH
	updateHealth(health) {
		// Update HEALTH Percent
		this.healthPercent.textContent = `${health} / 100`;

		// Update HEALTH Progress Bar
		this.healthProgressBar.style.width = `${health}%`;
	}

	// UPDATE ENERGY
	updateEnergy(currentEnergy, maxEnergy) {
		// Update ENERGY Percent
		this.energyPercent.textContent = `${currentEnergy} / ${maxEnergy}`;

		// Update ENERGY Progress Bar
		this.energyProgressBar.style.width = `${UI.calcPercent(currentEnergy, maxEnergy)}%`;
	}

	// UPDATE XP
	updateXP(currentXP, maxXP) {
		// Update XP (currentXP / maxXP)
		this.xpPoints.textContent = `${currentXP} / ${maxXP}`;

		// Update XP Progress Bar
		this.xpProgressBar.style.width = `${UI.calcPercent(currentXP, maxXP)}%`;
	}

	// UPDATE Level
	updateLevel(level) {
		this.levelBadge.textContent = `Level ${level}`;
		// TODO: pe viitor pot modifica culoarea elementului bazat pe argumentul level
	}

	// --------------------- WORLD STATS

	// UPDATE CURRENT WORLD DAY
	updateWorldInfoDay(day) {
		this.worldInfoDay.textContent = `☀ Day ${day}`;
	}

	// UPDATE CURRENT WORLD TIME
	updateWorldInfoTime(time) {
		this.worldInfoTime.textContent = `${time}`;
	}

	// UPDATE FARM STATUS
	updateFarmStatus(status) {
		this.farmStatus.textContent = `${status.icon} ${status.status}`;
		this.farmStatus.style.backgroundColor = status.color;
	}

	// UPDATE CURRENT AREA
	updateCurrentArea(area) {
		this.currentArea.textContent = area;
	}

	// UPDATE CURRENT LAND
	updateCurrentLand(land) {
		this.currentLand.textContent = land;
	}

	// UPDATE CURRENT LAND DESCRIPTION
	updateLandDescription(description) {
		this.landDescription.textContent = description;
	}

	// WORLD OBJECT HTML TEMPLATE
	createWorldObjectHTML(obj) {
		const html = `
         <article
				class="world-object resource-object"
					data-resource="${obj.resourceType}"
               data-world-object='${obj.worldObject}'
			>
				<div class="object-icon">${obj.icon}</div>

					<div class="object-content">
						<div class="object-header">
							<div>
								<h3>${obj.name}</h3>

								<span class="object-type"> ${obj.type} </span>
							</div>

									<span class="object-status" data-world-object-status> ${obj.status} </span>
							</div>

							<p class="object-description">
								${obj.description}
							</p>

						<div class="object-footer">
							<span> ${obj.resource.icon} ${obj.resource.name}: ${obj.currentAmount} </span>
					   </div>
				</div>
			</article>`;

		return html;
	}

	// ADD WORLD OBJECT
	addWorldObject(obj) {
		const html = this.createWorldObjectHTML(obj);

		this.worldObjectsContainer.insertAdjacentHTML("beforeend", html);
	}

	// EDIT WORLD OBJECT
	editWorldObject(worldObject, obj) {
		const element = this.worldObjectsContainer.querySelector(
			`[data-world-object="${worldObject}"]`,
		);

		if (!element) return;

		element.outerHTML = this.createWorldObjectHTML(obj);
	}

	// EDIT WORLD OBJECT STATUS
	updateWorldObjectStatus(worldObjectCode, status) {
		const element = this.worldObjectsContainer.querySelector(
			`[data-world-object="${worldObjectCode}"]`,
		);

		if (!element) {
			return;
		}

		const statusElement = element.querySelector(`[data-world-object-status]`);

		if (!statusElement) {
			return;
		}

		statusElement.textContent = status;
	}

	// REMOVE WORLD OBJECT
	removeWorldObject(worldObject) {
		const element = this.worldObjectsContainer.querySelector(
			`[data-world-object='${worldObject}']`,
		);

		if (element) element.remove();
	}

	// --------------------- WORLD TIME

	// GAME LOG MESSAGE TEMPLATE
	createGameLogMessage(author, msg) {
		const authorName = author === "narrator" ? "Narator" : `Mystic System`;
		const html = `
      <div class="message ${author}-message">
			<span class="message-author"> ${authorName} </span>
				<p>
					${msg}
				</p>
		</div>`;

		this.gameLogMessages.insertAdjacentHTML("beforeend", html);

		const maxMessageLog = 100;
		let logLength = this.gameLogMessages.querySelectorAll(".message").length;

		while (logLength > maxMessageLog) {
			this.gameLogMessages.firstElementChild.remove();

			logLength = this.gameLogMessages.querySelectorAll(".message").length;
		}

		this.gameLogMessages.scrollTo({
			top: this.gameLogMessages.scrollHeight,
			behavior: "smooth",
		});
	}

	// SEND NARRATOR MESSAGE
	sendNarratorMessage(msg) {
		this.createGameLogMessage(`narrator`, msg);
	}

	// SEND SYSTEM MESSAGE
	sendSystemMessage(msg) {
		this.createGameLogMessage(`system`, msg);
	}

	// --------------------- INVENTORY
	// SET INVENTORY ITEM COUNT
	setInventoryItemCount(weight, maxWeight) {
		this.inventoryWeight.textContent = `${weight} / ${maxWeight}`;
	}

	// CREATE INVENTORY CURRENCY HTML
	createInventoryCurrencyHTML(currencyObj) {
		const html = `
			<div class="currency-row" data-item-code='${currencyObj.itemCode}'>
			<span> ${currencyObj.icon} ${currencyObj.name} </span>

			<strong> ${currencyObj.amount} </strong>
			</div>
		`;

		return html;
	}

	// ADD INVENTORY CURRENCY
	addInventoryCurrency(currencyObj) {
		this.currencyContainer.insertAdjacentHTML(
			"beforeend",
			this.createInventoryCurrencyHTML(currencyObj),
		);
	}

	// EDIT INVENTORY CURRENCY
	editInventoryCurrency(currencyObjUpdated) {
		UI.getElementByItemCode(
			this.currencyContainer,
			currencyObjUpdated.itemCode,
		).outerHTML = this.createInventoryCurrencyHTML(currencyObjUpdated);
	}

	// REMOVE INVENTORY CURRENCY
	removeInventoryCurrency(itemCode) {
		UI.getElementByItemCode(this.currencyContainer, itemCode).remove();
	}

	// CREATE INVENTORY ITEM HTML
	createInventoryItemHTML(itemObj) {
		const amountOrDurability =
			itemObj?.type === "tool"
				? `
					<span class="inventory-item-durability">
						${itemObj.durability} / ${itemObj.maxDurability}
					</span>
					`
				: `
				<span class="inventory-item-quantity"> × ${itemObj.resource.amount} </span>`;

		const html = `
			<article class="inventory-item" data-item-code='${itemObj.itemCode}'>
				<div class="inventory-item-icon">${itemObj.resource.icon}</div>
					<div class="inventory-item-info">
						<div class="inventory-item-header">
							<span class="inventory-item-name"> ${itemObj.resource.name} </span>

							${amountOrDurability}
						</div>

						<p>
							${itemObj.description}
						</p>
				</div>
			</article>
		`;

		return html;
	}

	// ADD INVENTORY ITEM
	addInventoryItem(itemObj) {
		this.inventoryList.insertAdjacentHTML(
			"beforeend",
			this.createInventoryItemHTML(itemObj),
		);
	}

	// CHECK IF INVENTORY ITEM EXISTS IN UI
	hasInventoryItem(itemCode) {
		return Boolean(UI.getElementByItemCode(this.inventoryList, itemCode));
	}

	// EDIT INVENTORY ITEM
	editInventoryItem(itemObjUpdated) {
		UI.getElementByItemCode(
			this.inventoryList,
			itemObjUpdated.itemCode,
		).outerHTML = this.createInventoryItemHTML(itemObjUpdated);
	}

	// REMOVE INVENTORY ITEM
	removeInventoryItem(itemCode) {
		UI.getElementByItemCode(this.inventoryList, itemCode).remove();
	}

	// EQUIP / UNEQUIP TOOL
	updateToolEquippedState(itemCode, equipped) {
		const element = UI.getElementByItemCode(this.inventoryList, itemCode);

		if (!element) {
			return;
		}

		element.classList.toggle("equipped", equipped);
	}

	// UPDATE TOOL DURABILITY
	updateToolDurability(tool) {
		const toolUI = this.inventoryList.querySelector(
			`[data-item-code='${tool.itemCode}']`,
		);

		toolUI.querySelector(".inventory-item-durability").textContent =
			`${tool.durability} / ${tool.maxDurability}`;
	}

	// --------------------- ACTION WHEEL OVERLAY

	// RENDER ACTION WHEEL
	renderActionWheel(actions) {
		if (!actions) return;

		const angleStep = 360 / actions.length;

		const startAngle = -90;

		let distance = 130;

		if (actions.length <= 2) {
			distance = 105;
		} else if (actions.length <= 4) {
			distance = 125;
		} else {
			distance = 135;
		}

		// ASSIGN POSITION FOR EACH ACTION BUTTON ON WHEEL
		actions.forEach((action, index) => {
			const angle = startAngle + angleStep * index;

			const html = `
				<button
					class="action-wheel-item"
					data-action-code="${action.actionCode}"
					type="button"
					style="
						--angle: ${angle}deg;
						--target-distance: ${distance}px;
						--delay: ${index * 50}ms;
					"
				>
					<span class="action-wheel-item-icon">
						${action.icon}
					</span>

					<span>
						${action.name}
					</span>
				</button>
			`;

			actionWheel.insertAdjacentHTML("beforeend", html);
		});

		// OPEN OVERLAY
		requestAnimationFrame(() => {
			actionWheelOverlay.classList.add("open");
		});

		return new Promise((resolve) => {
			const handleActionClick = (e) => {
				const button = e.target.closest(".action-wheel-item");

				if (!button) return;

				const selectedAction = button.dataset.actionCode;

				this.actionWheelOverlay.classList.remove("open");

				cleanup();

				resolve(selectedAction);
			};

			const handleCancel = () => {
				this.actionWheelOverlay.classList.remove("open");

				cleanup();

				resolve(null);
			};

			const cleanup = () => {
				this.actionWheel.removeEventListener("click", handleActionClick);
				this.actionWheelCancel.removeEventListener("click", handleCancel);

				// CLEARING THE ACTION WHEEL AFTER THE INTERACTION
				this.actionWheel
					.querySelectorAll(".action-wheel-item")
					.forEach((actionEl) => actionEl.remove());
			};

			this.actionWheel.addEventListener("click", handleActionClick);

			this.actionWheelCancel.addEventListener("click", handleCancel);
		});
	}
}
