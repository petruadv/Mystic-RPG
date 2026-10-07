"use strict";

import Inventory from "./Inventory.js";

export default class Player {
	static zeroOrLess(amount) {
		return amount <= 0;
	}

	constructor({
		name,
		level = 1,
		xp = 0,
		maxXP = 100,
		health = 100,
		maxHealth = 100,
		energy = 100,
		maxEnergy = 100,
	}) {
		this.name = name;
		this.level = level;
		this.xp = xp;
		this.maxXP = maxXP;
		this.health = health;
		this.maxHealth = maxHealth;
		this.energy = energy;
		this.maxEnergy = maxEnergy;
		this.inventory = new Inventory();
	}

	useEnergy(amount) {
		if (Player.zeroOrLess(amount)) return false;
		if (this.energy < amount) return false;

		this.energy -= amount;

		return true;
	}

	restoreEnergy(amount) {
		if (Player.zeroOrLess(amount)) return 0;

		const oldEnergy = this.energy;

		this.energy = Math.min(this.energy + amount, this.maxEnergy);

		return this.energy - oldEnergy;
	}

	takeDamage(amount) {
		if (Player.zeroOrLess(amount)) return 0;

		const oldHealth = this.health;

		this.health = Math.max(this.health - amount, 0);

		return oldHealth - this.health;
	}

	heal(amount) {
		if (Player.zeroOrLess(amount)) return 0;

		const oldHealth = this.health;

		this.health = Math.min(this.health + amount, this.maxHealth);

		return this.health - oldHealth;
	}

	isDead() {
		return this.health <= 0;
	}

	addXP(amount) {
		if (Player.zeroOrLess(amount)) return 0;

		this.xp += amount;

		while (this.xp >= this.maxXP) {
			this.xp -= this.maxXP;

			this.levelUp();
		}
	}

	levelUp() {
		this.level++;

		this.maxXP = Math.round(this.maxXP * 1.2);
	}
}
