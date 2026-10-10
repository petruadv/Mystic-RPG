"use strict";

import WorldObject from "./WorldObject.js";

export default class Collectable extends WorldObject {
	constructor({
		// inherited
		worldObject,
		name,
		type,
		icon,
		status,
		description,
		actions,
		// individual
		collectables,
		collectOnce = true,
	}) {
		super({ worldObject, name, type, icon, status, description, actions });

		this.collectables = collectables;
		this.collectOnce = collectOnce;
	}
}
