"use strict";

export default class Inventory {
	constructor() {
		this.items = [];
		this.equippedTools = new Map();
	}

	findItem(itemCode) {
		return this.items.find((item) => item.item.itemCode === itemCode);
	}

	hasItem(itemCode) {
		return Boolean(this.findItem(itemCode));
	}

	addItem(item, amount = 1) {
		if (amount <= 0) return;

		const existingItem = this.findItem(item.itemCode);

		if (existingItem) {
			existingItem.amount += amount;

			return;
		}

		this.items.push({ item, amount });

		if (item.type === "tool") return "tool";
	}

	removeItem(itemCode, amount = 1) {
		if (amount <= 0) return;

		const inventoryItem = this.findItem(itemCode);

		if (!inventoryItem) return 0;

		const removedAmount = Math.min(amount, inventoryItem.amount);

		inventoryItem.amount -= removedAmount;

		if (inventoryItem.amount <= 0) {
			this.items = this.items.filter((item) => item.itemCode !== itemCode);
		}

		return removedAmount;
	}

	getItemAmount(itemCode) {
		const inventoryItem = this.items.find(
			(item) => item.itemCode === itemCode,
		);

		if (!inventoryItem) return 0;

		return inventoryItem.amount;
	}

	equipTool(tool) {
		this.equippedTools.set(tool.toolType, tool);
	}

	unequipTool(tool) {
		this.equippedTools.delete(tool.toolType);
	}

	toggleTool(tool) {
		if (this.isEquipped(tool)) {
			this.unequipTool(tool);

			return false;
		}

		this.equipTool(tool);

		return true;
	}

	isEquipped(tool) {
		return this.equippedTools.get(tool.toolType) === tool;
	}
}
