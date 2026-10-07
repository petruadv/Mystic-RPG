"use strict";

export default class Action {
	constructor({ actionCode, type, name, icon, energyCost = 0 }) {
		this.actionCode = actionCode;
		this.type = type;
		this.name = name;
		this.icon = icon;
		this.energyCost = energyCost;
	}

	hasEnergyCost() {
		return this.energyCost > 0;
	}
}
