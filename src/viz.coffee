translator = require "./translator"
Finger     = require "./finger"

##
# Set-up polyfills for unevenly supported features

##
# requestAnimationFrame
# http://dvcs.w3.org/hg/webperf/raw-file/tip/specs/RequestAnimationFrame/Overview.html
root = window ? global
root.requestAnimationFrame ||=
  root.webkitRequestAnimationFrame ||
  root.mozRequestAnimationFrame    ||
  root.oRequestAnimationFrame      ||
  root.msRequestAnimationFrame     ||
  (cb, elt) ->
    ##
    # Default to setTimeout. May we never execute this code.
    root.setTimeout( ->
      cb(+new Date())
    , 1000 / 60)

root.cancelAnimationFrame ||=
  root.webkitCancelRequestAnimationFrame ||
  root.mozCancelRequestAnimationFrame    ||
  root.oCancelRequestAnimationFrame      ||
  root.msCancelRequestAnimationFrame     ||
  (id) ->
    clearTimeout(id)

##
# High resolution time
# http://www.w3.org/TR/hr-time/#sec-high-resolution-time
root.performance ||= {}
perf = root.performance
perf.now  ||=
  perf.webkitNow ||
  perf.mozNow    ||
  perf.msNow     ||
  perf.oNow      ||
  ->
    # this is only compatable for relative caomparisons
    +(new Date())

canvas = $("#canvas")[0]
console.dir canvas
ctx = canvas.getContext("2d")
ctx.canvas.width  = window.innerWidth
ctx.canvas.height = window.innerHeight

width  = window.innerWidth
height = window.innerHeight

window.onResize = ->
  width  = ctx.canvas.width  = window.innerWidth
  height = ctx.canvas.height = window.innerHeight

class Viz
  constructor: ->
    @finger = new Finger(ctx, 0)

  run: (time = perf.now()) =>
    @frameId = root.requestAnimationFrame(@run)

    try 
      oscData = translator(JSON.parse(window.data))
    catch e
      return

    fingers = @filterFingers(oscData)
    @finger.draw(ctx, finger) for finger in fingers

    hands  = @filterHand(oscData)
    @finger.draw(ctx, hand, 80) for hand in hands

    return  

  filterFingers: (results) ->
    i for i in results when i['address'].match(/finger/i) and i['address'].match(/val/i)

  filterHand: (results) ->
    i for i in results when i['address'].match(/hand/i) and i['address'].match(/val/i)

module.exports = Viz

