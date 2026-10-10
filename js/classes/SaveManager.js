"use strict";

import Player from "./Player.js";
import Item from "./Item.js";
import Tool from "./Tool.js";

const STORAGE_KEY = "mystic-rpg-player";

export default class SaveManager {
	save(player) {
		const savedPlayer = {
			name: player.name,
			level: player.level,
			xp: player.xp,
			maxXP: player.maxXP,
			health: player.health,
			maxHealth: player.maxHealth,
			energy: player.energy,
			maxEnergy: player.maxEnergy,
			inventory: {
				items: player.inventory.items.map(({ item, amount }) => ({
					item: { ...item },
					amount,
				})),
				equippedTools: Array.from(
					player.inventory.equippedTools,
					([toolType, tool]) => ({
						toolType,
						itemCode: tool.itemCode,
					}),
				),
			},
		};

		localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPlayer));
	}

	load(initialPlayer) {
		const savedPlayer = JSON.parse(localStorage.getItem(STORAGE_KEY));

		if (!savedPlayer) {
			throw new Error("No saved player data was found.");
		}

		const player = new Player(savedPlayer);
		const savedItems = savedPlayer.inventory?.items ?? [];

		for (const { item: itemData, amount } of savedItems) {
			const item =
				itemData.type === "tool" ? new Tool(itemData) : new Item(itemData);

			player.inventory.addItem(item, amount);
		}

		const equippedTools = savedPlayer.inventory?.equippedTools;

		if (Array.isArray(equippedTools)) {
			for (const { toolType, itemCode } of equippedTools) {
				const inventoryItem = player.inventory.findItem(itemCode);
				const tool = inventoryItem?.item;

				if (tool?.type === "tool" && tool.toolType === toolType) {
					player.inventory.equipTool(tool);
				}
			}
		} else {
			if (initialPlayer) {
				for (const { item, amount } of initialPlayer.inventory.items) {
					if (!player.inventory.hasItem(item.itemCode)) {
						player.inventory.addItem(item, amount);
					}
				}
			}

			this.save(player);
		}

		return player;
	}

	checkExistingPlayer(initialPlayer) {
		const exists = Boolean(localStorage.getItem(STORAGE_KEY));

		if (exists) return this.load(initialPlayer);

		if (initialPlayer) {
			this.save(initialPlayer);

			return this.load();
		}

		return false;
	}
}
