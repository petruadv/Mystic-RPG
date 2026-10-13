export default class Time {
	constructor({ time }) {
		this.time = time;
	}

	elapseTime() {
		const addedTimePerInterval = 60 * 1000; /* 60s */

		this.time += addedTimePerInterval;

		return this.time;
	}

	getFormattedTime() {
		const time = new Date(this.time);

		const min = time.getUTCMinutes();
		const hour = time.getUTCHours();
		const day = Math.trunc(time / 24 / 60 / 60 / 1000) + 1;

		return { min, hour, day };
	}
}
