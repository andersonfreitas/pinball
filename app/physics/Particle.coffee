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
    @gravity = vec3.fromValues(0, 0, -9.81) # m^s

    @acceleration = vec3.create()

  # aggregate a force vector
  applyForce: (force) ->
    @forces = vec3.create()

    if @colliding
      vec3.add(@forces, @forces, @impactForces)
    else
      vel_sq2 = vec3.mul(vec3.create(), @velocity, @velocity)

      # https://en.wikipedia.org/wiki/Drag_equation
      # drag force: Fd = -1/2 * Cd * A * rho * v^2
      Fd = 0.5 * @Cd * @A * @rho

      drag = vec3.scale(vec3.create(), vel_sq2, Fd)
      vec3.normalize(drag, drag)

      vec3.add(@forces, @forces, force)
      vec3.add(@forces, @forces, drag)

  applyFriction: (coeff) ->

  checkForCollisions: (dt, staticWorld, particles)->
    direction = vec3.create() # n
    relative_velocity = vec3.create()
    vrn = 0.0
    impulse = 0.0 # J
    Fi = vec3.create()
    @colliding = false

    @impactForces = vec3.create()

    for obstacle in staticWorld
      unless obstacle.adjusted
        obstacle.adjusted = true
        _.each obstacle.faces, (face, i) ->
          _.each face.mesh, (vec, j) ->
            obstacle.faces[i].mesh[j] = add(vec, obstacle.position)

      collidingFace = Collision.testSphereAgainstFaces(@sphere, obstacle.faces)
      if collidingFace.collision
        direction = collidingFace.normal

        relative_velocity = @velocity
        vrn = vec3.dot(relative_velocity, direction)

        if vrn < 0.0
          impulse = -vrn * (0.7 + 1) / (1 / @mass)
          Fi = vec3.clone(direction)
          vec3.scale(Fi, Fi, impulse/dt)
          vec3.add(@impactForces, @impactForces, Fi)

          # corrigir a instabilidade
          # @sphere.position[1] += @radius
          @colliding = true
          audio.effects.chomp.sing()
          addScore()
          break

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

  updateEuler: (dt) ->
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

  updateVerlet: (dt) ->
    last_acceleration = @acceleration

    new_pos = add(scale(@velocity, dt), scale(last_acceleration, dt*dt*0.5))

    vec3.add(@sphere.position, @sphere.position, new_pos)

    new_acceleration = scale(@forces, 1/@mass)

    @acceleration = scale(add(last_acceleration, new_acceleration), 0.5)

    @velocity = add(@velocity, scale(@acceleration, dt))

  current_force: (position, velocity) ->
    forces = vec3.create()

    if @colliding
      vec3.add(forces, forces, @impactForces)

    vel_sq2 = vec3.mul(vec3.create(), velocity, velocity)

    # https://en.wikipedia.org/wiki/Drag_equation
    # drag force: Fd = -1/2 * Cd * A * rho * v^2
    Fd = 0.5 * @Cd * @A * @rho

    drag = scale(vel_sq2, Fd)
    vec3.normalize(drag, drag)

    forces = add(forces, @gravity)
    forces = add(forces, drag)

    forces = scale(forces, 1/@mass)
    forces

  updateRK4: (dt) ->
    pos = @sphere.position

    @acceleration = @current_force(pos, @velocity)
    # 1st
    xk1 = scale(@velocity, dt)
    vk1 = scale(@acceleration, dt)

    # 2nd
    midVelocity = add(@velocity, scale(vk1, 0.5))
    xk2 = scale(midVelocity, dt)
    vk2 = scale(scale(@current_force(add(pos, scale(xk1, 0.5)), midVelocity), 1/@mass), dt)

    # 3rd
    midVelocity = add(@velocity, scale(vk2, 0.5))
    xk3 = scale(midVelocity, dt)
    vk3 = scale(scale(@current_force(add(pos, scale(xk2, 0.5)), midVelocity), 1/@mass), dt)

    # 4th
    midVelocity = add(@velocity, vk3)
    xk4 = scale(midVelocity, dt)
    vk4 = scale(scale(@current_force(add(pos, xk3), midVelocity), 1/@mass), dt)

    @sphere.position = add(@sphere.position, scale(add(add(xk1, scale(xk2, 2.0)), add(xk4, scale(xk3, 2.0))), 1/6))
    @velocity = add(@velocity, scale(add(add(vk1, scale(vk2, 2.0)), add(vk4, scale(vk3, 2.0))), 1/6))

window.RigidBody = Particle
