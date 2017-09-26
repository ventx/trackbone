const expect = require('chai').expect;
const UptimeDefinition = require('../src/UptimeDefinition');
const ScheduleDefinition = require('../src/ScheduleDefinition');
const Schedule = require('../src/Schedule');

let uptimeDefinitions = {
	"1": new UptimeDefinition("@1+09:00-12:00+13:00-18:00"),
	"2": new UptimeDefinition("@2+10:00-17:00"),
	"3": new UptimeDefinition("@3+15:00-16:00")
};

describe("Schedule", function () {

	it("has a default 24/7 on setting", function () {
		let schedule = new Schedule("");
		expect(schedule.instanceShouldRun(1, "09:00")).to.equal(true);
	});

	it("is created correctly with one day", function () {
		let schedule = new Schedule("");
		schedule.addScheduleDefinition(new ScheduleDefinition(uptimeDefinitions, "Mo#1"));
		expect(schedule.instanceShouldRun(1, "09:00")).to.equal(true);
		expect(schedule.instanceShouldRun(1, "12:00")).to.equal(false);
	});

	it("cycles correctly from the back, if there is no earlier time definition", function () {
		let schedule = new Schedule("");
		schedule.addScheduleDefinition(new ScheduleDefinition(uptimeDefinitions, "Su#1"));
		expect(schedule.instanceShouldRun(1, "09:00")).to.equal(false);
		expect(schedule.instanceShouldRun(7, "11:00")).to.equal(true);
	});

	it("builds schedules with multiple days", function () {
		let schedule = new Schedule("");
		["Mo#1", "Tu#1", "We#1", "Th#1", "Fr#2", "Sa#3"].map(def => {
			schedule.addScheduleDefinition(new ScheduleDefinition(uptimeDefinitions, def))
		});

		// check monday
		expect(schedule.instanceShouldRun(1, "08:59")).to.equal(false);
		expect(schedule.instanceShouldRun(1, "09:00")).to.equal(true);
		expect(schedule.instanceShouldRun(1, "12:00")).to.equal(false);
		expect(schedule.instanceShouldRun(1, "13:00")).to.equal(true);
		expect(schedule.instanceShouldRun(1, "17:59")).to.equal(true);
		expect(schedule.instanceShouldRun(1, "18:00")).to.equal(false);

		// check tuesday
		expect(schedule.instanceShouldRun(2, "08:59")).to.equal(false);
		expect(schedule.instanceShouldRun(2, "09:00")).to.equal(true);
		expect(schedule.instanceShouldRun(2, "12:00")).to.equal(false);
		expect(schedule.instanceShouldRun(2, "13:00")).to.equal(true);
		expect(schedule.instanceShouldRun(2, "17:59")).to.equal(true);
		expect(schedule.instanceShouldRun(2, "18:00")).to.equal(false);

		// check friday
		expect(schedule.instanceShouldRun(5, "09:00")).to.equal(false);
		expect(schedule.instanceShouldRun(5, "10:00")).to.equal(true);
		expect(schedule.instanceShouldRun(5, "16:30")).to.equal(true);
		expect(schedule.instanceShouldRun(5, "17:59")).to.equal(false);

		// check sunday
		expect(schedule.instanceShouldRun(7, "09:00")).to.equal(false);
		expect(schedule.instanceShouldRun(7, "10:00")).to.equal(false);
		expect(schedule.instanceShouldRun(7, "16:30")).to.equal(false);
		expect(schedule.instanceShouldRun(7, "17:59")).to.equal(false);
	});

});