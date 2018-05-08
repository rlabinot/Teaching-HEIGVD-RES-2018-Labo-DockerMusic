// Author : Labinot Rashiti
// Brief : A UDP Server who listens to Musicians and keep track of active musicians.
//         Also a TCP server who give the active musician

// From nodejs.org
const dgram = require("dgram");
const socket = dgram.createSocket("udp4");
const net = require("net");

// From protocol
const protocol = require("./protocol");
const moment = require("moment");

// When a musician join the multicast group
socket.bind(protocol.PORT, function() {
    console.log("Joining multicast group");
    socket.addMembership(protocol.MULTICAST_IP);
});

// When the server receive a data from a musician
socket.on('message', function(msg, source) {
    console.log("Data has arrived: " + msg + ". Source port: " + source.port);
    var data = JSON.parse(msg);

    // looking if there is already a musician with same instrument
    for (var i = 0; i < musicians.length; i++) {
        if (data.uuid == musicians[i].uuid) {
            musicians[i].activeSince = data.activeSince; // refresh time remaining
            return;
        }
    }
    musicians.push(data); // adding a new musician
});

// array to save the actives musicians
const musicians = [];


var tcpServer = net.createServer();
tcpServer.listen(protocol.PORT);
console.log("TCP Server now running on port : " + protocol.PORT);

// when there is a telnet connection
tcpServer.on('connection', function (socket) {
    socket.write(JSON.stringify(musicians));
	socket.destroy();
});

// check if a musician/instrument is still active
function checkInstruments() {
    for (var i = 0; i < musicians.length; i++) {
        // determine if a musician is active or not
        if (moment() - musicians[i].activeSince > protocol.DELAY) {
            console.log('Mucisian removed : ' + JSON.stringify(musicians[i]));
            musicians.splice(i, 1); // remove the musician from array
        }
    }
}

// launch the auditor
setInterval(checkInstruments, protocol.AUDITOR_INTERVAL);
