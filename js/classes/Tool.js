"use strict";

import Item from "./Item.js";

export default class Tool extends Item {
	constructor({
		itemCode,
		name,
		icon,
		description,
		toolType,
		efficiency,
		durability,
		maxDurability,
	}) {
		super({ itemCode, name, icon, description, type: "tool" });

		this.toolType = toolType;
		this.efficiency = efficiency;
		this.durability = durability;
		this.maxDurability = maxDurability;
	}

	hasRequiredDurability(amount) {
		return this.durability >= amount;
	}

	isBroken() {
		return this.durability <= 0;
	}

	use(amount) {
		if (this.isBroken()) return;

		if (this.durability < amount) return;

		this.durability -= amount;

		return true;
	}
}
