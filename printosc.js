(function() {
  var inport, osc, sock, udp;
  osc = require('osc-min');
  udp = require("dgram");
  if (process.argv[2] != null) {
    inport = parseInt(process.argv[2]);
  } else {
    inport = 8000;
  }
  console.log("OSC listener running at http://localhost:" + inport);
  sock = udp.createSocket("udp4", function(msg, rinfo) {
    try {
      return console.log(osc.fromBuffer(msg));
    } catch (error) {
      return console.log("invalid OSC packet");
    }
  });
  sock.bind(inport);
}).call(this);
