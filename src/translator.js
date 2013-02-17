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
    messages.push({address: "/hand/on", value: [0]});
  } else if (newHandOn) {
    messages.push({address: "/hand/on", value: [1]});
    messages.push({address: "/hand/val", value: json.hands[0]['palmPosition']});
  }
  handOn = newHandOn;
  return messages;
}


var idxPoolSize = 8;
var pointableOn = [];
var idxPool = defaultPool();
var pToIdx = [];

function defaultPool() {
  var pool = [];
  for (var i = idxPoolSize-1; i >= 0; i--) {
    pool.push(i);
  }
  return pool;
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
      var idx = pToIdx[i];
      messages.push({address: "/pointable/" + idx + "/val", value: pointables[i]});
    } else if (pointableOn[i]) {
      var idx = pToIdx[i];
      messages.push({address: "/pointable/" + idx + "/on", value: [0]});
      pToIdx[i] = undefined;
      idxPool.push(idx);

      // reset pool when no pointables are on
      if (idxPool.length === idxPoolSize) {
        idxPool = defaultPool();
      }
    } else if (newPointableOn[i]) {
      var idx = idxPool.pop();
      pToIdx[i] = idx;
      messages.push({address: "/pointable/" + idx + "/on", value: [1]});
      messages.push({address: "/pointable/" + idx + "/val", value: pointables[i]});
    }
  }
  pointableOn = newPointableOn;
  return messages;
};

module.exports = pointableMessages;
