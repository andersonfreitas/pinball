@Paleta = class extends ObjFile
  constructor: ->
    super('paleta-esq2', 'paleta-esq_Mesh.010', 'assets/images/madeira.jpg')
    @animating = false

  animate: (@duration = 1000) ->
    # unless @animating
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

      a = @lerp(0, 60, delta)
      b = @lerp(60, 0, delta)
      rot = @lerp(a, b, delta)

      @rotation = vec3.fromValues(0, rot, 0)

  lerp: (a, b, t) ->
    a + (b - a) * t || 0
