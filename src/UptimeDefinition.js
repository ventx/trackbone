/**
 * Converts an uptime definition into two array. One
 * for start timestamps and one for stop timestamps
 * @author Wolfgang Felbermeier <wolfgang@ventx.de>
 */
class UptimeDefinition {

	/**
	 * Creates a new uptime definition
	 * @param {string} uptimeDefinitionString The uptime definition string (e.g. @1+15:00-17:00)
	 */
	constructor(uptimeDefinitionString) {
		let rawStart = uptimeDefinitionString.match(/\+(\d{2}:\d{2})/g);
		let rawStop = uptimeDefinitionString.match(/-(\d{2}:\d{2})/g);
		this.startTimestamps = rawStart ? rawStart.map(u => u.replace('+', '')).sort() : [];
		this.stopTimestamps = rawStop ? rawStop.map(u => u.replace('-', '')).sort() : [];
		this.uptimeIdentifier = /@([a-zA-Z1-9_]*)[+-]/.exec(uptimeDefinitionString)[1];
	}

}

module.exports = UptimeDefinition;