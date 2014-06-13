class RigidBody
  constructor: (@renderable, @mass) ->
    @renderable
    @mass

    @velocity = vec3.create()
    @acceleration = vec3.create()

  applyForce: (forceVector) ->
    force = vec3.create()
    vec3.div(force, forceVector, vec3.fromValues(@mass, @mass, @mass))
    vec3.add(@acceleration, @acceleration, force)

  applyFriction: (coeff) ->
    friction = vec3.clone(@velocity)
    vec3.multiply(friction, friction, vec3.fromValues(-1, -1, -1))
    vec3.normalize(friction, friction)
    vec3.multiply(friction, friction, vec3.fromValues(coeff,coeff,coeff))
    @applyForce(friction)

  update: ->
    vec3.add(@velocity, @velocity, @acceleration)
    vec3.add(@renderable.position, @renderable.position, @velocity)
    @acceleration = vec3.create()

  checkForCollisions: ->
    boundary = 7
    if @renderable.position[0] < -boundary
      @velocity[0] *= -1
      @renderable.position[0] = -boundary
    else if @renderable.position[0] > boundary
      @velocity[0] *= -1
      @renderable.position[0] = boundary

    if @renderable.position[1] < -0
      @velocity[1] *= -1
      @renderable.position[1] = 0
    else if @renderable.position[1] > boundary
      @velocity[1] *= -1
      @renderable.position[1] = boundary

    if @renderable.position[2] < -boundary
      @velocity[2] *= -1
      @renderable.position[2] = -boundary
    else if @renderable.position[2] > boundary
      @velocity[2] *= -1
      @renderable.position[2] = boundary

# class ShapeSphere extends RigidBodyShape
#   constructor: (@renderable, @mass, @radius) ->

#   intersectPlane: ->
#   intersectSphere: ->

window.RigidBody = RigidBody
