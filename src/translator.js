
function defaultPool(size) {
  var pool = [];
  for (var i = size-1; i >= 0; i--) {
    pool.push(i);
  }
  return pool;
}

// hand-related stuff

var handOn = false;
var hIdxPoolSize = 2;
var hIdxPool = defaultPool(hIdxPoolSize);
var hToIdx = [];

function onHandOn(idx, hand) {
  return [{address: "/hand/" + idx + "/on", value: [1]}];
}

function onHandOff(idx, hand) {
  return [{address: "/hand/" + idx + "/on", value: [0]}];
}

function onHandChange(idx, hand) {
  return [{address: "/hand/" + idx + "/val", value: hand['palmPosition']},
          {address: "/hand/" + idx + "/vel", value: hand['palmVelocity']},
          {address: "/hand/" + idx + "/direction", value: hand['direction']},
          {address: "/hand/" + idx + "/radius", value: hand['sphereRadius']}
          ];
}

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
    hands[h['id']] = h;
  }
  for (var i = 0; i < Math.max(handOn.length, newHandOn.length); i++) {
    if (handOn[i] && newHandOn[i]) {
      var idx = hToIdx[i];
      h = hands[i];
      messages.push.apply(messages, onHandChange(idx, h));
    } else if (handOn[i]) {
      var idx = hToIdx[i];
      h = hands[i];
      messages.push.apply(messages, onHandOn(idx, h));
      hToIdx[i] = undefined;
      hIdxPool.push(idx);

      // reset pool when no hands are on
      if (hIdxPool.length === hIdxPoolSize) {
        hIdxPool = defaultPool(hIdxPoolSize);
      }
    } else if (newHandOn[i]) {
      var idx = hIdxPool.pop();
      hToIdx[i] = idx;
      h = hands[i];
      messages.push.apply(messages, onHandOn(idx, h));
      messages.push.apply(messages, onHandChange(idx, h));
    }
  }
  handOn = newHandOn;
  return messages;
}

// finger-related stuff

var fingerOn = [];
var fIdxPoolSize = 8;
var fIdxPool = defaultPool(fIdxPoolSize);
var fToIdx = [];

function onFingerOn(idx, finger) {
  return [{address: "/finger/" + idx + "/on", value: [1]}];
}

function onFingerOff(idx, finger) {
  return [{address: "/finger/" + idx + "/on", value: [0]}];
}

function onFingerChange(idx, finger) {
  return [{address: "/finger/" + idx + "/val", value: finger['tipPosition']},
          {address: "/finger/" + idx + "/vel", value: finger['tipVelocity']}];
}

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
    fingers[f['id']] = f;
  }
  for (var i = 0; i < Math.max(fingerOn.length, newFingerOn.length); i++) {
    if (fingerOn[i] && newFingerOn[i]) {
      var idx = fToIdx[i];
      messages.push.apply(messages, onFingerChange(idx, fingers[i]));
    } else if (fingerOn[i]) {
      var idx = fToIdx[i];
      messages.push.apply(messages, onFingerOff(idx, fingers[i]));
      fToIdx[i] = undefined;
      fIdxPool.push(idx);

      // reset pool when no fingers are on
      if (fIdxPool.length === fIdxPoolSize) {
        fIdxPool = defaultPool(fIdxPoolSize);
      }
    } else if (newFingerOn[i]) {
      var idx = fIdxPool.pop();
      fToIdx[i] = idx;
      f = fingers[i];
      messages.push.apply(messages, onFingerOn(idx, f));
      messages.push.apply(messages, onFingerChange(idx, f));
    }
  }
  fingerOn = newFingerOn;
  return messages;
}

module.exports = function(json) {
  return handMessages(json).concat(fingerMessages(json));
}
