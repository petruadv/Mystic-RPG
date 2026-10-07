"use strict";

export default class Item {
	constructor({ itemCode, name, icon, description, type }) {
		this.itemCode = itemCode;
		this.name = name;
		this.icon = icon;
		this.description = description;
		this.type = type;
	}
}
