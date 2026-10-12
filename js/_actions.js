"use strict";

import Action from "./classes/Action.js";

const _actions = {
	// CHOP
	chop: new Action({
		actionCode: "chop",
		type: "harvest",

		name: "Chop",
		icon: "🪓",

		energyCost: 4,
	}),

	// MINE
	mine: new Action({
		actionCode: "mine",
		type: "harvest",

		name: "Mine",
		icon: "⛏",

		energyCost: 1,
	}),

	// INSPECT
	inspect: new Action({
		actionCode: "inspect",
		type: "inspect",

		name: "Inspect",
		icon: "🔎",
	}),

	// COLLECT
	collect: new Action({
		actionCode: "collect",
		type: "collect",

		name: "Collect",
		icon: "✋",
	}),

	// DROP
	drop: new Action({
		actionCode: "drop",
		type: "drop",

		name: "Drop",
		icon: "❌",
	}),

	// EQUIP
	toggleEquip: new Action({
		actionCode: "toggleEquip",
		type: "toggleEquip",

		name: "Equip / Unequip",
		icon: "❌",
	}),
};
export default _actions;
