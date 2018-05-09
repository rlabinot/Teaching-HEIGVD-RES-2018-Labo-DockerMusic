// Author : Labinot Rashiti
// Brief : A UDP client who sends a instrument sound to an Auditor every given time.

// From nodejs.org
const dgram = require("dgram");
const server = dgram.createSocket("udp4");

// Other libraries
const protocol = require("./protocol");
const uuid = require("uuid");
const moment = require("moment");

var instruments = new Map();
instruments.set("piano", protocol.PIANO);
instruments.set("trumpet", protocol.TRUMPER);
instruments.set("flute", protocol.FLUTE);
instruments.set("violin", protocol.VIOLIN);
instruments.set("drum", protocol.DRUM);

function Musician(instrument) {
    this.instrument = instrument;

    // ici, sinon chaque fois qu'un "musicien" envoie une data
    // il generve un nouvel ID ce qui est problematique !
    var data = { 
        uuid: uuid(),
        instrument: instrument
    }
    
    Musician.prototype.sendMessage = function() {
        
        // on update la date/heure avant l'envoi
        data.activeSince = moment();
        
        var payload = JSON.stringify(data);
        var message = new Buffer(payload);
		server.send(message, 0, message.length, protocol.PORT, protocol.MULTICAST_IP, function(err, bytes) {
			console.log("Sending payload: " + payload);
		});
    }

    // send the sound every given interval
    setInterval(this.sendMessage.bind(this), protocol.MUSICIAN_INTERVAL);
}

var instrument = process.argv[2];
var m1 = new Musician(instrument);

