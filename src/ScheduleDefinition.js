/**
 * A schedule definition covers the start/stop cycle
 * of one day.
 * @author Wolfgang Felbermeier <wolfgang@ventx.de>
 */
class ScheduleDefinition {

	/**
	 * Creates a new schedule definition.
	 * @param {Object} uptimeDefinitions All available uptime definitions.
	 * The index of the object should be the name of
	 * the uptime definition
	 * @param {String} scheduleDefinitionString The schedule definition string (e.g. 'Mo#1')
	 */
	constructor(uptimeDefinitions, scheduleDefinitionString) {
		this.matchingUptimeDefinitions = scheduleDefinitionString.match(/#([a-zA-Z1-9_]*)/g)
			.map(s => s.replace('#', ''));
		this.startTimestamps = this.matchingUptimeDefinitions
			.map(s => uptimeDefinitions[s].startTimestamps)
			.reduce((acc, val) => acc.concat(val), []).sort();
		this.stopTimestamps = this.matchingUptimeDefinitions
			.map(s => uptimeDefinitions[s].stopTimestamps)
			.reduce((acc, val) => acc.concat(val), []).sort();
		let weekmap = {
			Mo: 1,
			Tu: 2,
			We: 3,
			Th: 4,
			Fr: 5,
			Sa: 6,
			Su: 7,
		};
		this.matchingWeekday = weekmap[/(Mo|Tu|We|Th|Fr|Sa|Su).*/.exec(scheduleDefinitionString)[1]];
	}

}

module.exports = ScheduleDefinition;