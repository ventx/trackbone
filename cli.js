#!/usr/bin/env node
const trackbone = require('./src/Trackbone');
let tr = new trackbone();
tr.run().then(actionMap => console.log(actionMap)).catch(err => console.log(err));