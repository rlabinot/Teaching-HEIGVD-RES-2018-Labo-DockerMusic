// Author : Labinot Rashiti
// Brief : A UDP client who sends a instrument sound to an Auditor every given time.

// From nodejs.org
const dgram = require("dgram");
const server = dgram.createSocket("udp4");

// From protocol
const protocol = require("./protocol");


var instruments = new Map();
instruments.set("piano", protocol.PIANO);
instruments.set("trumpet", protocol.TRUMPER);
instruments.set("flute", protocol.FLUTE);
instruments.set("violin", protocol.VIOLIN);
instruments.set("drum", protocol.DRUM);


function Musician(instrument) {
    this.instrument = instrument;

    Musician.prototype.sendSound = function() {
        var sound = instruments.get(instrument);
        var payload = JSON.stringify(sound);
        var message = new Buffer(payload);
        server.send(message,protocol.PORT,"localhost",function(err, bytes) {
			console.log("Sending payload: " + payload + " via port " + server.address().port);
		});
    }

    // send the sound every given interval
    setInterval(this.sendSound.bind(this), protocol.MUSICIAN_INTERVAL);
}

var instrument = process.argv[2];
var m1 = new Musician(instrument);

