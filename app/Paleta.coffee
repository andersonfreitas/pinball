@Paleta = class extends ObjFile
  @LEFT: 0
  @RIGHT: 1
  constructor: (@mode) ->
    if @mode == Paleta.LEFT
      name = 'paleta-esq'
    else
      name = 'paleta-dir'
    super(name, name, 'assets/images/madeira.jpg')
    @animating = false

  animate: (@up, @duration = 1000) ->
    @animationTime = 0
    @animating = true
    @rotation = vec3.create()

  updateAnimation: (elapsed) ->
    this.animationTime += elapsed

    if @animating
      delta = @animationTime / @duration

      delta = Math.min(delta, 1.0)
      if delta >= 1.0
        @animating = false

      # a = @lerp(0, 60, delta)
      # b = @lerp(60, 0, delta)
      # rot = @lerp(a, b, delta)

      if @up
        rot = @lerp(30, 0, delta) if @mode == Paleta.LEFT
        rot = @lerp(-30, 0, delta) if @mode == Paleta.RIGHT
      else
        rot = @lerp(0, 30, delta) if @mode == Paleta.LEFT
        rot = @lerp(0, -30, delta) if @mode == Paleta.RIGHT

      @rotation = vec3.fromValues(0, rot, 0)

  lerp: (a, b, t) ->
    a + (b - a) * t || 0
