const expect = require('chai').expect;
const Trackbone = require('../src/Trackbone');

describe("Trackbone", function(){

	it("verifies correct tags", function(){
		expect(Trackbone.verifyTrackboneTag("@1+12:30-14:00|Mo#1")).to.equal(true);
		expect(Trackbone.verifyTrackboneTag("@1+12:30-14:00|Mo#1#2abc_")).to.equal(true);
		expect(Trackbone.verifyTrackboneTag("@1+12:30-14:00|Mo#1#2abc_|@2+10:00")).to.equal(true);
		expect(Trackbone.verifyTrackboneTag("@1+12:30-14:00|Mo#1#2abc_|@2+10:00|Fr#2")).to.equal(true);
	});

	it("filters empty tags", function(){
		expect(Trackbone.verifyTrackboneTag("")).to.equal(false);
	});

	it("filters wrong formatted tags", function(){
		expect(Trackbone.verifyTrackboneTag("@ 1|Mo2")).to.equal(false);
		expect(Trackbone.verifyTrackboneTag("@ 1|Mo#2")).to.equal(false);
		expect(Trackbone.verifyTrackboneTag("@ 1|Mo#2")).to.equal(false);
		expect(Trackbone.verifyTrackboneTag("@1|Mo|Fr")).to.equal(false);
	});
});