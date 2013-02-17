var WebSocketClient = require('websocket').client;
var client          = new WebSocketClient();
var osc             = require('osc-min');
var dgram           = require('dgram');
var translator      = require('./src/translator');
var udp = dgram.createSocket("udp4");

var outport = process.env.OUTPORT || 8800;

client.on('connectFailed', function(error) {
  console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
  console.log('WebSocket client connected');
  connection.on('error', function(error) {
    console.log("Connection Error: " + error.toString());
  });
  connection.on('close', function() {
    console.log('echo-protocol Connection Closed');
  });
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      var json     = JSON.parse(message.utf8Data);
      var messages = translator(json);
      var msg      = null;

      while (messages.length > 0) {
        msg = messages.pop();
        sendOSCMessage(msg.address, msg.value);
      }
    }
  });
});

var sendOSCMessage = function (address, arg) {
  var buf = osc.toBuffer({
    address: address,
    args: arg
  });

  udp.send(buf, 0, buf.length, outport, "localhost");
};

client.connect('ws://localhost:6437/');
