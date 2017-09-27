exports.handler = function(event, context, callback) {
	let trackbone = require('./src/Trackbone');
	let tr = new trackbone();
	tr.run()
		.then((actionMap) => callback(null, actionMap))
		.catch((err) => callback(555, err));
};