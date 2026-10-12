"use strict";
import _actions from "../_actions.js";

export default class Item {
	static actionsByItemType = {
		tool: ["toggleEquip", "inspect", "drop"],
		resource: ["inspect", "drop"],
	};

	static setActions(type) {
		return this.actionsByItemType[type].map((action) => _actions[action]);
	}

	constructor({ itemCode, name, icon, description, type }) {
		this.itemCode = itemCode;
		this.name = name;
		this.icon = icon;
		this.description = description;
		this.type = type;
		this.actions = Item.setActions(this.type);
	}

	getActions() {
		const actions = this.actions;

		console.log();

		if (actions) return actions;
	}
}
