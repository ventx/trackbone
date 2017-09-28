const Schedule = require('./Schedule');
const moment = require('moment-timezone');

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2();

/**
 * The Trackbone class. Fetches all running or stopped instances
 * from your AWS Account with a trackbone tag,
 * analyses the tag and starts and stops the instances according to the definition
 *
 * Uses UTC as default timezone. When you set the environment variable TIMEZONE,
 * this value will be used instead.
 * @author Wolfgang Felbermeier <wolfgang@ventx.de>
 */
class Trackbone {

	/**
	 * @param {string} timezone The timezone trackbone should use
	 */
	constructor(timezone) {
		this.timezone = timezone;
	}

	/**
	 * Runs trackbone
	 * @return {Promise}
	 */
	run(){
		return new Promise((resolve, reject) => {
			let m = new moment().tz(process.env.TIMEZONE || this.timezone || 'UTC');
			let dayOfWeek = m.format('E');
			let time = m.format('HH:mm');
			this.fetchInstances(dayOfWeek, time).then((actionMap) => {
				if (actionMap.shouldStart.length > 0) {
					ec2.startInstances({
						InstanceIds: actionMap.shouldStart,
						DryRun: false
					}, (err, data) => {
					});
				}
				if (actionMap.shouldStop.length > 0) {
					ec2.stopInstances({
						InstanceIds: actionMap.shouldStop,
						DryRun: false
					}, (err, data) => {
					});
				}
				resolve(actionMap);
			}).catch((err) => reject(err));
		});
	}

	/**
	 * Fetches all instances and creates the according schedules.
	 * In the end, creates a start/stop object with two entries,
	 * first one "shouldStart" is an array with all the InstanceIds
	 * of instances, that should be started and the second one "shouldStop"
	 * contains all InstanceIds of instances, that should stop.
	 * @param dayOfWeek The ISO day of the week (1-7)
	 * @param time The time in format HH:mm
	 */
	fetchInstances(dayOfWeek, time) {
		return new Promise((resolve, reject) => {
			ec2.describeInstances({
				Filters: [
					{
						Name: "tag-key",
						Values: [
							"Trackbone",
							"trackbone",
							"TRACKBONE"
						]
					},
					{
						Name: "instance-state-code",
						Values: ["16", "80"]
					}
				]
			}, (err, data) => {
				if (err) {
					reject(err);
				} else if (data.Reservations[0] && data.Reservations[0].Instances) {
					let actionMap = {
						shouldStart: [],
						shouldStop: [],
						dayOfWeek: dayOfWeek,
						time: time
					};
					data.Reservations[0].Instances.map(instance => {
						let instanceRunning = (instance.State.Code === 16);
						let trackboneTagValue = instance.Tags.find(t => t.Key.toUpperCase() === "TRACKBONE").Value;
						if (Trackbone.verifyTrackboneTag(trackboneTagValue)) {
							let instanceSchedule = new Schedule(trackboneTagValue);
							let instanceShouldRun = instanceSchedule.instanceShouldRun(dayOfWeek, time);
							if (instanceRunning !== instanceShouldRun) {
								instanceShouldRun ? actionMap.shouldStart.push(instance.InstanceId) : actionMap.shouldStop.push(instance.InstanceId);
							}
						}
					});
					resolve(actionMap);
				} else {
					reject("no instances active");
				}
			});
		});
	}

	/**
	 * Verifies the correct syntax of the trackbone tag
	 * @param {string} bone
	 * @return {boolean}
	 */
	static verifyTrackboneTag(bone) {
		return /^((@[a-zA-Z0-9_]*([+-][0-9]{2}:[0-9]{2})*)|((Mo|Tu|We|Th|Fr|Sa|Su)(#[a-zA-Z0-9_]+)+)|\|)+$/.test(bone);
	}
}

module.exports = Trackbone;