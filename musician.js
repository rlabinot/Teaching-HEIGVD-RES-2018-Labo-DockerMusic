// Author : Labinot Rashiti
// Brief : A UDP client who sends a instrument sound to an Auditor every given time.

// From nodejs.org
const dgram = require("dgram");
const server = dgram.createSocket("udp4");

// From protocol
const protocol = require("./protocol");

var instrument = process.argv[2];

var instruments = new Map();
instruments.set("piano", protocol.PIANO);
instruments.set("trumpet", protocol.TRUMPER);
instruments.set("flute", protocol.FLUTE);
instruments.set("violin", protocol.VIOLIN);
instruments.set("drum", protocol.DRUM);
var sound = instruments.get(instrument);

var sendSound = function sendSound() {
    var payload = JSON.stringify(sound);
    var message = new Buffer(payload);
    server.send(message,protocol.PORT,"localhost",(err)=>{
        server.close();
    });
    console.log("Sending payload: " + payload + " via port " + server.address().port);
}

// send the sound every given interval
setInterval(sendSound, protocol.MUSICIAN_INTERVAL);