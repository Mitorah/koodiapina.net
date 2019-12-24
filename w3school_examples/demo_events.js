var events = require('events');
var eventEmitter = new events.EventEmitter();

var myEventHandler = function () {
    console.log("I hear a scream.");
}

eventEmitter.addListener('scream', myEventHandler);
eventEmitter.emit('scream');