module.exports = function (json) {
  var messages = [];
  if (json["hands"]) {
    var arg  = "Hello?";
    var hand = null;
    if (hand = json.hands[0]) {
      messages.push({address: "/hand/" + hand["id"], value: arg}); 
    }
  }

  return messages;
};
