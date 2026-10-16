"use strict";

import _actions from "./_actions.js";
import _items from "./_items.js";
import _templates from "./_templates.js";
import Collectable from "./classes/Collectable.js";
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

		requiredTool: "axe",

		actions: [_actions.chop, _actions.inspect],

		resource: _items.wood,

		maxAmount: 10,

		xpReward: 5,
		harvestAmount: 1,

		restoreCooldown: 10,
	}),

	// STONE DEPOSIT
	stoneDeposit: new ResourceNode({
		worldObject: "stone-deposit",

		name: "Stone Deposit",
		type: "Mine",

		icon: "⬢",
		status: "Ready",

		description:
			"O formațiune densă de rocă, bogată în Stone, ce poate fi exploatată cu uneltele potrivite.",

		requiredTool: "pickaxe",

		actions: [_actions.mine, _actions.inspect],

		resource: _items.stone,

		maxAmount: 20,

		xpReward: 4,
		harvestAmount: 1,

		restoreCooldown: 25,
	}),

	// MYSTERY BOX
	mysteryBox: new Collectable({
		worldObject: "mystery-box",
		name: "Mystery Box",
		type: "Mystery Box",
		icon: "🎁",
		status: "Ready",
		description: "O cutie misterioasă cu obiecte cadou care te asteaptă.",
		actions: [_actions.collect, _actions.inspect],
		collectables: new Map([
			[1, _items.woodenAxe],
			[5, _items.wood],
			[10, _templates.currencyGold],
		]),
		collectOnce: true,
	}),
};
export default _worldObjects;
