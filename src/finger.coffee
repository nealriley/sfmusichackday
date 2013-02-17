class Finger
  draw: (ctx, data) ->
    ctx.save()
    width = window.innerWidth
    height = window.innerHeight

    x = Math.abs(data['value'][0]  + 500) << 0
    y = Math.abs(-data['value'][1] + 500) << 0
    radius = 30
    
    r = (Math.random() * 255) << 0 
    g = (Math.random() * 255) << 0
    b = (Math.random() * 255) << 0

    color = "rgba(#{r}, #{g}, #{b}, 0.5)"

    ctx.globalCompositeOperation = "source-over"
    ctx.fillStyle = "rgba(0,0,0,0.1)"
    ctx.fillRect(0, 0, width, height)

    ctx.globalCompositeOperation = "lighter"

    ctx.beginPath()
    gradient = ctx.createRadialGradient(x, y, 0, x, y, 30)
    gradient.addColorStop(0, "white")
    gradient.addColorStop(0.4, "white")
    gradient.addColorStop(0.4, color)
    gradient.addColorStop(1, "black")
    ctx.fillStyle = gradient

    ctx.arc(x, y, radius, Math.PI*2, false)
    ctx.fill()

    ctx.restore()


module.exports = Finger