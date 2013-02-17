class Finger
  constructor: (ctx, @color) ->
    cvs = $('#canvas')
    cvs.width = window.innerWidth
    cvs.height = window.innerHeight
    ctx.clearRect(0, 0, 600, 600)
    grad = ctx.createRadialGradient(0,0,0,0,0,600)
    grad.addColorStop(0, '#000')
    grad.addColorStop(1, "rgb(#{@color}, #{@color}, #{@color})")
    ctx.fillStyle = grad

    # draw 600x600 fill
    ctx.fillRect(0,0,600,600)
    ctx.restore()
    
  draw: (ctx, data) ->
    ctx.save()
    width = window.innerWidth
    height = window.innerHeight
    x = data['value'][0] + 400
    y = -data['value'][1] + 400
    rx = 600 * x / width
    ry = 600 * y / height
        
    xc = ~~(256 * x / width)
    yc = ~~(256 * y / height)

    console.log rx, ry, 0
    grad = ctx.createRadialGradient(rx, ry, 0, rx, ry, 600)
    grad.addColorStop(0, '#000')
    grad.addColorStop(1, ['rgb(', xc, ', ', (255 - xc), ', ', yc, ')'].join(''))
    ctx.restore()

module.exports = Finger