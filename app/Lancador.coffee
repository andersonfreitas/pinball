@Lancador = class extends ObjFile
  constructor: (@mode) ->
    super('lancador', 'lancador', 'assets/images/madeira.jpg')

  animate: (@end) ->
    @animationTime = 0
    @animating = true
    @duration = 150
    # @position = vec3.create()

  updateAnimation: (elapsed) ->
    this.animationTime += elapsed

    if @animating
      delta = @animationTime / @duration

      delta = Math.min(delta, 1.0)
      if delta >= 1.0
        @animating = false

      a = vec3.lerp(vec3.create(), vec3.create(), vec3.fromValues(0, 0, -0.1), delta)
      b = vec3.lerp(vec3.create(), vec3.fromValues(0, 0, -0.1), vec3.create(), delta)
      if @end
        @position = b
      else
        @position = a

      # @position = vec3.lerp(vec3.create(), a, b, delta)
