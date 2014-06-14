###
Particle Physics

@author Anderson Freitas
###

class Particle
  AIR_DENSITY = 1.23
  constructor: (@renderable, @mass, @radius) ->
    @renderable
    @mass
    @radius

    # @position = vec3.create()
    @velocity = vec3.create()
    @forces = vec3.create()

    @speed = 0

    @colliding = false
    @impactForces
    @previousPosition

  # aggregate a force vector
  applyForce: (force) ->
    @forces = vec3.create()

    if @colliding
      vec3.add(@forces, @forces, @impactForces)
    else
      vec3.add(@forces, @forces, force)

      drag = vec3.create()
      vec3.negate(drag, @velocity)
      vec3.normalize(drag, drag)

      fDrag = 0.5 * AIR_DENSITY * @speed * @speed * π * @radius * @radius * 0.6
      # fDrag = 1
      vec3.scale(drag, drag, fDrag)
      vec3.add(@forces, @forces, drag)

  applyFriction: (coeff) ->

  checkForCollisions: (dt)->
    direction = vec3.create() # n
    relative_velocity = vec3.create()
    vrn = 0.0
    impulse = 0.0 # J
    Fi = vec3.create()
    @colliding = false

    @impactForces = vec3.create()

    if @renderable.position[1] <= @radius
      direction = vec3.fromValues(0, 1, 0)

      relative_velocity = @velocity
      vrn = vec3.dot(relative_velocity, direction)

      if vrn < 0.0
        impulse = -vrn * (0.60 + 1) / (1 / @mass)
        Fi = vec3.clone(direction)
        vec3.scale(Fi, Fi, impulse/dt)
        vec3.add(@impactForces, @impactForces, Fi)

        @renderable.position[1] = @radius
        @colliding = true

  ###
  dt = time step
  ###
  update: (dt) ->
    acceleration = vec3.create()
    dv = vec3.create()
    ds = vec3.create()

    # a = forces / mass
    vec3.scale(acceleration, @forces, 1/@mass)
    # vec3.add(acceleration, acceleration, @forces)

    # dv = a * dt
    vec3.scale(dv, acceleration, dt)

    # velocity += dv
    vec3.add(@velocity, @velocity, dv)

    # ds = velocity * dt
    vec3.scale(ds, @velocity, dt)

    # position += ds
    vec3.add(@renderable.position, @renderable.position, ds)

    # speed = velocity.magnitude
    @speed = vec3.length(@velocity)


window.RigidBody = Particle
