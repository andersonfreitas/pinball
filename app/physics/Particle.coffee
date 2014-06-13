###
Particle Physics

@author Anderson Freitas
###

class Particle
  constructor: (@renderable, @mass, @radius) ->
    @renderable
    @mass
    @radius

    # @position = vec3.create()
    @velocity = vec3.create()
    @forces = vec3.create()

    # @speed
    # @gravity

  # aggregate a force vector
  applyForce: (force) ->
    @forces = vec3.create()

    vec3.add(@forces, @forces, force)


  ###
  dt = time step
  ###
  update: (dt) ->
    acceleration = vec3.create()
    dv = vec3.create()
    ds = vec3.create()

    # a = forces / mass
    vec3.div(acceleration, @forces, @mass)

    # dv = a * dt
    vec3.scale(dv, acceleration, dt)

    # ds = velocity * dt
    vec3.mul(ds, @velocity, dt)

    # position += ds
    vec3.add(@renderable.position, @renderable.position, ds)

    # speed = velocity.magnitude
    @speed = vec3.length(@velocity)


window.Particle = Particle
