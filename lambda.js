const Trackbone = require('./src/Trackbone');

exports.handler = function(event, context, callback) {
	let tr = new Trackbone();
	tr.run()
		.then((actionMap) => callback(null, actionMap))
		.catch((err) => callback(err));
};