"use strict";

import Item from "./classes/Item.js";
import Tool from "./classes/Tool.js";

const _items = {
	// 			[RESOURCES]

	wood: new Item({
		itemCode: "resource-wood",
		name: "Wood",
		icon: "🌲",

		description: "Material de bază folosit pentru construcții și crafting.",

		type: "resource",
	}),

	stone: new Item({
		itemCode: "resource-stone",
		name: "Stone",
		icon: "⬢",

		description: "Material de bază folosit pentru construcții și crafting.",

		type: "resource",
	}),

	// 			[TOOLS]

	woodenAxe: new Tool({
		itemCode: "tool-axe",
		name: "Wooden Axe",
		icon: "🪓",
		description:
			"Un topor simplu din lemn, folosit pentru tăierea copacilor.",
		toolType: "axe",
		efficiency: 1,
		durability: 50,
		maxDurability: 50,
	}),

	stoneAxe: new Tool({
		itemCode: "tool-axe",
		name: "Stone Axe",
		icon: "🪓",
		description:
			"Un topor simplu din piatră, folosit pentru tăierea copacilor.",
		toolType: "axe",
		efficiency: 2,
		durability: 75,
		maxDurability: 75,
	}),

	woodenPickaxe: new Tool({
		itemCode: "tool-pickaxe",
		name: "Wooden Pickaxe",
		icon: "🪓",
		description:
			"Un tarnacop simplu din lemn, folosit pentru exploatarea minereurilor.",
		toolType: "pickaxe",
		efficiency: 1,
		durability: 50,
		maxDurability: 50,
	}),
};
export default _items;
