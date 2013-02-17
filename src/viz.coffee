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

h1 = 1
h2 = 285
dir = 1

class Viz
  constructor: ->
    @finger = new Finger(ctx, 0)

  run: (time = perf.now()) =>
    @frameId = root.requestAnimationFrame(@run)

    try 
      window.oscData = translator(JSON.parse(window.data))
    catch e
      return

    #@finger.draw(ctx, thing) if thing = window.oscData[0]

    drawItem = (positionArray) -> 
      xposition = positionArray['value'][0]*2
      yposition = (-positionArray['value'][1]+300)*2
      ctx.save()
      #ctx.fillStyle = "rgb(#{red}, #{green}, #{blue})"
      ctx.fillStyle = "hsl(#{h1}, 50%, 80%)"
      ctx.fillRect(xposition, yposition, 50, 50)

    #drawItem(item) for item in window.oscData
    @finger.draw(ctx, item) for item in window.oscData

    h1 = h1 + dir
    h2 = h2 - dir

    if (h1 > 284 || h1 < 1) then dir = -1 * dir

    return  

module.exports = Viz

