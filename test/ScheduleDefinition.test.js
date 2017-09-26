const expect = require('chai').expect;
const UptimeDefinition = require('../src/UptimeDefinition');
const ScheduleDefinition = require('../src/ScheduleDefinition');

let uptimeDefinitions = {
	"1": new UptimeDefinition("@1+09:00-12:00+13:00-18:00"),
	"2": new UptimeDefinition("@2+10:00-17:00")
};

describe("ScheduleDefinition", function () {

	it("parses the weekdays correctly", function () {
		let scheduleDefinition = new ScheduleDefinition(uptimeDefinitions, "Mo#1");
		expect(scheduleDefinition.matchingWeekday).to.equal(1);
		scheduleDefinition = new ScheduleDefinition(uptimeDefinitions, "Tu#1");
		expect(scheduleDefinition.matchingWeekday).to.equal(2);
		scheduleDefinition = new ScheduleDefinition(uptimeDefinitions, "We#1");
		expect(scheduleDefinition.matchingWeekday).to.equal(3);
		scheduleDefinition = new ScheduleDefinition(uptimeDefinitions, "Th#1");
		expect(scheduleDefinition.matchingWeekday).to.equal(4);
		scheduleDefinition = new ScheduleDefinition(uptimeDefinitions, "Fr#1");
		expect(scheduleDefinition.matchingWeekday).to.equal(5);
		scheduleDefinition = new ScheduleDefinition(uptimeDefinitions, "Sa#1");
		expect(scheduleDefinition.matchingWeekday).to.equal(6);
		scheduleDefinition = new ScheduleDefinition(uptimeDefinitions, "Su#1");
		expect(scheduleDefinition.matchingWeekday).to.equal(7);
	});

	it("parses the matching uptime definition identifiers", function () {
		let scheduleDefinition = new ScheduleDefinition(uptimeDefinitions, "Mo#1");
		expect(scheduleDefinition.matchingUptimeDefinitions).to.eql(["1"]);
	});

	it("parses multiple matching uptime definition identifiers", function () {
		let scheduleDefinition = new ScheduleDefinition(uptimeDefinitions, "Mo#1#2");
		expect(scheduleDefinition.matchingUptimeDefinitions).to.eql(["1", "2"]);
	});

	it("builds a correct start and stop schedule definition", function () {
		let scheduleDefinition = new ScheduleDefinition(uptimeDefinitions, "Mo#1");
		expect(scheduleDefinition.startTimestamps).to.eql(["09:00", "13:00"]);
		expect(scheduleDefinition.stopTimestamps).to.eql(["12:00", "18:00"]);
	});

	it("builds a correct start and stop schedule definition with multiple uptime definitions", function () {
		let scheduleDefinition = new ScheduleDefinition(uptimeDefinitions, "Mo#1#2");
		expect(scheduleDefinition.startTimestamps).to.eql(["09:00", "10:00", "13:00"]);
		expect(scheduleDefinition.stopTimestamps).to.eql(["12:00", "17:00", "18:00"]);
	});

});