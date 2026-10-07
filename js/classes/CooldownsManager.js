"use strict";

export default class CooldownsManager {
	constructor() {
		this.cooldowns = new Map();
	}

	add(code, duration, onComplete) {
		const timeout = setTimeout(() => {
			this.cooldowns.delete(code);

			if (onComplete) {
				onComplete();
			}
		}, duration * 1000);

		const startTime = Date.now();
		const endTime = startTime + duration * 1000;

		this.cooldowns.set(code, { code, duration, startTime, endTime, timeout });

		return true;
	}

	has(code) {
		return this.cooldowns.has(code);
	}

	remove(code) {
		const cooldown = this.cooldowns.get(code);

		if (!cooldown) {
			return false;
		}

		clearTimeout(cooldown.timeout);

		this.cooldowns.delete(code);

		return true;
	}

	clear() {
		for (const cooldown of this.cooldowns.values()) {
			clearTimeout(cooldown.timeout);
		}

		this.cooldowns.clear();
	}

	get(code) {
		return this.cooldowns.get(code);
	}

	getRemainingTime(code) {
		const cooldown = this.cooldowns.get(code);

		if (!cooldown) return 0;

		const remaining = cooldown.endTime - Date.now();

		return Math.max(remaining / 1000, 0);
	}
}
