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

red = 0
green = 0
blue  = 0

class Viz
  run: (time = perf.now()) =>
    @frameId = root.requestAnimationFrame(@run)

    ctx.save();
    ctx.fillStyle = "rgb(#{red}, #{green}, #{blue})"
    ctx.fillRect(20, 20, 20, 20)

    red = (red + 1) % 256
    green = (green + 1) % 256
    blue = (blue + 1) % 256
        
    return  

module.exports = Viz

