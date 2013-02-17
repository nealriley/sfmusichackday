
function defaultPool(size) {
  var pool = [];
  for (var i = size-1; i >= 0; i--) {
    pool.push(i);
  }
  return pool;
}

var handOn = false;
var hIdxPoolSize = 2;
var hIdxPool = defaultPool(hIdxPoolSize);
var hToIdx = [];

function handMessages(json) {
  var messages = [];
  if (!json.hasOwnProperty('hands')) {
    return messages;
  }
  newHandOn = [];
  hands = {};
  for (i in json.hands) {
    h = json.hands[i];
    newHandOn[h.id] = true;
    hands[h['id']] = h['palmPosition'];
  }
  for (var i = 0; i < Math.max(handOn.length, newHandOn.length); i++) {
    if (handOn[i] && newHandOn[i]) {
      var idx = hToIdx[i];
      messages.push({address: "/hand/" + idx + "/val", value: hands[i]});
    } else if (handOn[i]) {
      var idx = hToIdx[i];
      messages.push({address: "/hand/" + idx + "/on", value: [0]});
      hToIdx[i] = undefined;
      hIdxPool.push(idx);

      // reset pool when no hands are on
      if (hIdxPool.length === hIdxPoolSize) {
        hIdxPool = defaultPool(hIdxPoolSize);
      }
    } else if (newHandOn[i]) {
      var idx = hIdxPool.pop();
      hToIdx[i] = idx;
      messages.push({address: "/hand/" + idx + "/on", value: [1]});
      messages.push({address: "/hand/" + idx + "/val", value: hands[i]});
    }
  }
  handOn = newHandOn;
  return messages;
}

var fingerOn = [];
var fIdxPoolSize = 8;
var fIdxPool = defaultPool(fIdxPoolSize);
var fToIdx = [];

function fingerMessages(json) {
  var messages = [];
  if (!json.hasOwnProperty('hands')) {
    return messages;
  }
  newFingerOn = [];
  fingers = {};
  for (i in json.pointables) {
    f = json.pointables[i];
    newFingerOn[f.id] = true;
    fingers[f['id']] = f['tipPosition'];
  }
  for (var i = 0; i < Math.max(fingerOn.length, newFingerOn.length); i++) {
    if (fingerOn[i] && newFingerOn[i]) {
      var idx = fToIdx[i];
      messages.push({address: "/finger/" + idx + "/val", value: fingers[i]});
    } else if (fingerOn[i]) {
      var idx = fToIdx[i];
      messages.push({address: "/finger/" + idx + "/on", value: [0]});
      fToIdx[i] = undefined;
      fIdxPool.push(idx);

      // reset pool when no fingers are on
      if (fIdxPool.length === fIdxPoolSize) {
        fIdxPool = defaultPool(fIdxPoolSize);
      }
    } else if (newFingerOn[i]) {
      var idx = fIdxPool.pop();
      fToIdx[i] = idx;
      messages.push({address: "/finger/" + idx + "/on", value: [1]});
      messages.push({address: "/finger/" + idx + "/val", value: fingers[i]});
    }
  }
  fingerOn = newFingerOn;
  return messages;
}

module.exports = function(json) {
  return handMessages(json).concat(fingerMessages(json));
}
