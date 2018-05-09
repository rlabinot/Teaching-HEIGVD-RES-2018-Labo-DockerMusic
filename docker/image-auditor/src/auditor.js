// Author : Labinot Rashiti
// Brief : A UDP Server who listens to Musicians and keep track of active musicians.
//         Also a TCP server who give the active musician

// From nodejs.org
var dgram = require("dgram");
var socket = dgram.createSocket("udp4");
var net = require("net");

// From protocol
var protocol = require("./protocol");
var moment = require("moment");

// When a musician join the multicast group
socket.bind(protocol.PORT, function() {
    console.log("Joining multicast group");
    socket.addMembership(protocol.MULTICAST_IP);
});


// When the server receive a data from a musician
socket.on('message', function(msg, source) {
    console.log("Data from a Musician has arrived: " + msg + ". Source port: " + source.port);
        
    var musician = JSON.parse(msg);

	// Look if a musician is already there by his uuid
    for (var i = 0; i < musicians.length; i++) {
        if (musician.uuid == musicians[i].uuid) {
            musicians[i].activeSince = musician.activeSince; // refresh the time remaining
            return;
        }
    }
    musicians.push(musician); // add the musician because he is not listed
});


var tcpServer = net.createServer();
// when there is a telnet connection
tcpServer.on('connection', function (socket) {
    
    //TODO j'appel ici le clean du tableau d'actifs, 
    //dès que le serv reçoit une connexion
    checkInstruments();
    socket.write(JSON.stringify(musicians));
	socket.end();
});

// check if a musician/instrument is still active
function checkInstruments() {
    for (var i = 0; i < musicians.length; i++) {
        // determine if a musician is active or not
        if (moment().diff(musicians[i].activeSince) > protocol.DELAY) {
            console.log('Mucisian removed : ' + JSON.stringify(musicians[i]));
            musicians.splice(i, 1);
        }
    }
}

// array to save the actives musicians
var musicians = [];
tcpServer.listen(protocol.PORT);
console.log("TCP Server now running on port : " + protocol.PORT);
