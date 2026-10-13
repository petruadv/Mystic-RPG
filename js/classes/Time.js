export default class Time {
	constructor({ time }) {
		this.time = time;
	}

	elapseTime() {
		const addedTimePerInterval = 60 * 1000; /* 60s */

		this.time += addedTimePerInterval;

		return this.time;
	}
}
