// --------------------------------------------------------------------------
// max_sockets.js - a generic Node/Express application that serves up the
//                  requested web pages, and manages a socket connection
//                  with any requesting pages. This is part of the Node for
//                  Max system for Max 8.
// --------------------------------------------------------------------------


const Max = require("max-api");
const io = require('socket.io-client');

const serverIP = require('./config.js');
const localhostIP = 'http://localhost:8000';

var socket;
var namespace = '/controller';

Max.post('script start');
connectServer();

Max.addHandler('local', () => {
	connectLocal();
});

Max.addHandler('server', () => {
	connectServer();
});

function connectLocal() {
	Max.post('connect to local server');
	if (socket) socket.disconnect();
	socket = io(localhostIP+namespace);
	addSocketListener();
}


function connectServer() {
	Max.post('connect to server');
	if (socket) socket.disconnect();
	socket = io(serverIP+namespace);
	addSocketListener();
}

function addSocketListener() {
	socket.on('connect', (data) => {
		Max.post('connected!');

		//receiver: 
	    socket.on('debug', (message) => {
			Max.post(message)
		});

		socket.on('speakOver', (message) => {
			//Max.bang();
			Max.outlet(true);
		});

		socket.on('osc', (message) => {
			Max.post(message)
			Max.outlet(message)
		});

		//sender: 
	    const sender = function (data) {
			Max.post(data);
			socket.emit(data.name, data.value);
		};

		Max.addHandler('speak', (message) => {
			Max.post(message);
			//socket.emit('', message);
			sender({name:'speak', value:message});
		});

		Max.addHandler('speakAdvance', (dict) => {
			Max.post(dict);
			//socket.emit('', message);
			sender({name:'speakAdvance', value:dict});
		});

		Max.addHandler('speakConfig', (message) => {
			Max.post(message);
			//socket.emit('', message);
			sender({name:'speakConfig', value:message});
		});

	})
}

