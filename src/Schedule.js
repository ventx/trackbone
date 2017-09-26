const UptimeDefinition = require('./UptimeDefinition');
const ScheduleDefinition = require('./ScheduleDefinition');

const createTree = require("functional-red-black-tree");

/**
 * The run schedule for an instance. A schedule covers
 * one week long start/stop cycle of an instance.
 * Feed it with one day schedule definitions and
 * it will be happy to serve you.
 * @author Wolfgang Felbermeier <wolfgang@ventx.de>
 */
class Schedule {

	/**
	 * Creates a new schedule based on the given trackbone tag
	 * @param {string} bone The trackbone tag value
	 */
	constructor(bone) {
		this.tree = createTree();
		let uptimeDefinitions = bone.match(/(@[a-zA-Z0-9_]*[0-9+\-:]+)/g);
		if (uptimeDefinitions) {
			uptimeDefinitions = uptimeDefinitions.map(d => new UptimeDefinition(d))
				.reduce((acc, val) => {
					acc[val.uptimeIdentifier] = val;
					return acc;
				}, {});
			let scheduleDefinitions = bone.match(/(Mo|Tu|We|Th|Fr|Sa|Su)#[a-zA-Z0-9_]*+/g);
			if (scheduleDefinitions) {
				scheduleDefinitions = scheduleDefinitions.map(s => new ScheduleDefinition(uptimeDefinitions, s));
			}
			scheduleDefinitions.map(s => this.addScheduleDefinition(s));
		}
	}

	/**
	 * Adds a ScheduleDefinition to this schedule.
	 * @param {ScheduleDefinition} scheduleDefinition
	 */
	addScheduleDefinition(scheduleDefinition) {
		scheduleDefinition.startTimestamps.map(t => {
			this.tree = this.tree.insert(scheduleDefinition.matchingWeekday + t, true)
		});
		scheduleDefinition.stopTimestamps.map(t => {
			this.tree = this.tree.insert(scheduleDefinition.matchingWeekday + t, false)
		});
	}

	/**
	 * Get, whether an instance with this schedule should be running at a given moment.
	 * @param {number} weekday The number of the day of the week (1-7)
	 * @param {string} time The time in 24h  format (hh:mm)
	 * @returns {boolean}
	 */
	instanceShouldRun(weekday, time) {
		if (this.tree.length === 0) {
			return true;
		}
		let iterator = this.tree.le(weekday + time);
		return iterator.value ? iterator.value : this.tree.end.value;
	}

}

module.exports = Schedule;