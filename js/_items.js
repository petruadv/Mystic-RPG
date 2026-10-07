"use strict";

import Item from "./classes/Item.js";

const _items = {
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
};
export default _items;
