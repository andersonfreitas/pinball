###
Particle Physics

@author Anderson Freitas
###

class Particle
  constructor: (@sphere, @mass) ->
    @radius = @sphere.radius

    @A = π * @radius * @radius / 10000 # m^2
    @rho = 1.225 # kg/m^3 (air density at 15ºC)
    @Cd = 0.47 # coefficient of drag

    @velocity = vec3.create()
    @forces = vec3.create()

    @speed = 0

    @colliding = false
    @impactForces

  # aggregate a force vector
  applyForce: (force) ->
    @forces = vec3.create()

    if @colliding
      vec3.add(@forces, @forces, @impactForces)
    else
      vel_sq2 = vec3.mul(vec3.create(), @velocity, @velocity)

      # drag force: Fd = -1/2 * Cd * A * rho * v^2
      Fd = 0.5 * @Cd * @A * @rho

      drag = vec3.scale(vec3.create(), vel_sq2, Fd)
      vec3.normalize(drag, drag)

      vec3.add(@forces, @forces, force)
      vec3.add(@forces, @forces, drag)

  applyFriction: (coeff) ->

  checkForCollisions: (dt, objects, particles)->
    direction = vec3.create() # n
    relative_velocity = vec3.create()
    vrn = 0.0
    impulse = 0.0 # J
    Fi = vec3.create()
    @colliding = false

    @impactForces = vec3.create()

    if @sphere.position[1] <= @radius
      direction = vec3.fromValues(0, 1, 0) # da face

      relative_velocity = @velocity
      vrn = vec3.dot(relative_velocity, direction)

      if vrn < 0.0
        impulse = -vrn * (0.70 + 1) / (1 / @mass)
        Fi = vec3.clone(direction)
        vec3.scale(Fi, Fi, impulse/dt)
        vec3.add(@impactForces, @impactForces, Fi)

        @sphere.position[1] = @radius
        @colliding = true

    for particle in particles
      r = @radius + particle.radius
      distance = vec3.create()
      # distance = position - other.position
      vec3.sub(distance, @sphere.position, particle.sphere.position)

      separation = vec3.length(distance) - r

      if separation <= 0.0
        vec3.normalize(distance, distance)
        direction = distance
        vec3.sub(relative_velocity, @velocity, particle.velocity)
        vrn = vec3.dot(relative_velocity, direction)

        if vrn < 0.0
          impulse = -vrn * (0.6 + 1) / (1 / @mass + 1 / particle.mass)
          Fi = vec3.clone(direction)
          vec3.scale(Fi, Fi, impulse/dt)
          vec3.add(@impactForces, @impactForces, Fi)

          pos = vec3.create()
          vec3.scale(pos, direction, separation)
          vec3.sub(@sphere.position, @sphere.position, pos)

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
    vec3.add(@sphere.position, @sphere.position, ds)

    # speed = velocity.magnitude
    @speed = vec3.length(@velocity)


window.RigidBody = Particle
