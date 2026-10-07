"use strict";

import _actions from "./_actions.js";
import _items from "./_items.js";
import ResourceNode from "./classes/ResourceNode.js";

const _worldObjects = {
	// ANCIENT PINE
	ancientPine: new ResourceNode({
		worldObject: "ancient-pine",

		name: "Ancient Pine",
		type: "Tree",

		icon: "🌲",
		status: "Ready",

		description: "Un pin înalt care poate fi tăiat pentru a obține Wood.",

		actions: [_actions.chopAction, _actions.inspectAction],

		resource: _items.wood,

		maxAmount: 10,

		xpReward: 5,
		harvestAmount: 2,

		restoreCooldown: 10,
	}),

	// STONE DEPOSIT
	stoneDeposit: new ResourceNode({
		worldObject: "stone-deposit",

		name: "Stone Deposit",
		type: "Mine",

		icon: "⛏",
		status: "Ready",

		description:
			"O formațiune densă de rocă, bogată în Stone, ce poate fi exploatată cu unelte potrivite.",

		actions: [_actions.mineAction, _actions.inspectAction],

		resource: _items.stone,

		maxAmount: 20,

		xpReward: 4,
		harvestAmount: 1,

		restoreCooldown: 25,
	}),
};
export default _worldObjects;
