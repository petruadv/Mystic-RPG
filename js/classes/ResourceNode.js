"use strict";

import WorldObject from "./WorldObject.js";

export default class ResourceNode extends WorldObject {
	constructor({
		worldObject,
		name,
		type,
		icon,
		status,
		description,
		actions,
		resource,
		maxAmount,
		harvestAmount,
		xpReward,
		restoreCooldown,
	}) {
		super({
			worldObject,
			name,
			type,
			icon,
			status,
			description,
			actions,
		});

		this.resource = resource;
		this.maxAmount = maxAmount;
		this.currentAmount = maxAmount;
		this.harvestAmount = harvestAmount;
		this.xpReward = xpReward;
		this.restoreCooldown = restoreCooldown;
	}

	isDepleted() {
		return this.currentAmount <= 0;
	}

	harvest(amount) {
		if (amount <= 0) return 0;
		if (this.isDepleted()) return 0;

		const harvestedAmount = Math.min(amount, this.currentAmount);

		this.currentAmount -= harvestedAmount;

		// replaced with respawn timer
		// if (this.isDepleted()) {
		// 	this.setStatus("Depleted");
		// }

		return harvestedAmount;
	}

	getActions() {
		if (this.isDepleted()) {
			return this.actions.filter(
				(action) => action.actionCode !== "harvest",
			);
		}

		return this.actions;
	}

	restore() {
		this.currentAmount = this.maxAmount;
		this.status = "Ready";
	}
}
