var pointableOn = [];

module.exports = function (json) {
  var messages = [];
  if (!json.hands) {
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
