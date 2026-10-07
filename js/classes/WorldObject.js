"use strict";

export default class WorldObject {
	constructor({
		worldObject,
		name,
		type,
		icon,
		status,
		description,
		actions = [],
	}) {
		this.worldObject = worldObject;
		this.name = name;
		this.type = type;
		this.icon = icon;
		this.status = status;
		this.description = description;
		this.actions = actions;
	}

	getActions() {
		return this.actions;
	}

	getAction(actionCode) {
		return this.getActions().find(
			(action) => action.actionCode === actionCode,
		);
	}

	setStatus(status) {
		return (this.status = status);
	}
}
