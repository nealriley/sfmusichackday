var pointableOn = [];
var handOn = false;

function handMessages(json) {
  var messages = [];
  if (!json.hasOwnProperty('hands')) {
    return messages;
  }
  newHandOn = json.hands.length > 0;
  if (handOn && newHandOn) {
    messages.push({address: "/hand/val", value: json.hands[0]['palmPosition']});
  } else if (handOn) {
    messages.push({address: "/hand/on", value: 0});
  } else if (newHandOn) {
    messages.push({address: "/hand/on", value: 1});
    messages.push({address: "/hand/val", value: json.hands[0]['palmPosition']});
  }
  handOn = newHandOn;
  return messages;
}

function pointableMessages(json) {
  var messages = [];
  if (!json.hasOwnProperty('hands')) {
    return messages;
  }
  newPointableOn = [];
  pointables = {};
  for (i in json.pointables) {
    p = json.pointables[i];
    newPointableOn[p.id] = true;
    pointables[p['id']] = p['tipPosition'];
  }
  for (var i = 0; i < Math.max(pointableOn.length, newPointableOn.length); i++) {
    if (pointableOn[i] && newPointableOn[i]) {
      messages.push({address: "/pointable/" + i + "/val", value: pointables[i]});
    } else if (pointableOn[i]) {
      messages.push({address: "/pointable/" + i + "/on", value: 0});
    } else if (newPointableOn[i]) {
      messages.push({address: "/pointable/" + i + "/on", value: 1});
      messages.push({address: "/pointable/" + i + "/val", value: pointables[i]});
    }
  }
  pointableOn = newPointableOn;
  return messages;
};

module.exports = handMessages;
