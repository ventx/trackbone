const expect = require('chai').expect;
const UptimeDefinition = require('../src/UptimeDefinition');

describe("UptimeDefinition", function(){

	it("parses the uptime definition identifier correctly", function(){
		let uptime = new UptimeDefinition("@1_test4+12:00-13:00");
		expect(uptime.uptimeIdentifier).to.equal("1_test4");
	});

	it("parses the start timestamps correctly", function(){
		let uptime = new UptimeDefinition("@1_test4+12:00");
		expect(uptime.startTimestamps).to.eql(["12:00"]);
	});

	it("parses the stop timestamps correctly", function(){
		let uptime = new UptimeDefinition("@1_test4-12:00");
		expect(uptime.stopTimestamps).to.eql(["12:00"]);
	});

	it("parses mixed start and stop timestamps correctly", function(){
		let uptime = new UptimeDefinition("@1_test4-12:00+13:00-14:00+17:00");
		expect(uptime.startTimestamps).to.eql(["13:00", "17:00"]);
		expect(uptime.stopTimestamps).to.eql(["12:00", "14:00"]);
	});

	it("sorts mixed start and stop timestamps correctly", function(){
		let uptime = new UptimeDefinition("@1_test4-18:21+13:00-14:00+11:00");
		expect(uptime.startTimestamps).to.eql(["11:00", "13:00"]);
		expect(uptime.stopTimestamps).to.eql(["14:00", "18:21"]);
	});

});