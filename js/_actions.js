"use strict";

import Action from "./classes/Action.js";

const _actions = {
	// CHOP
	chopAction: new Action({
		actionCode: "chop",
		type: "harvest",

		name: "Chop",
		icon: "🪓",

		energyCost: 4,
	}),

	// MINE
	mineAction: new Action({
		actionCode: "mine",
		type: "harvest",

		name: "Mine",
		icon: "⛏",

		energyCost: 1,
	}),

	// INSPECT
	inspectAction: new Action({
		actionCode: "inspect",
		type: "inspect",

		name: "Inspect",
		icon: "🔎",
	}),
};
export default _actions;
