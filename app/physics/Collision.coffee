add = (a, b) ->
  vec3.add(vec3.create(), a, b)

sub = (a, b) ->
  vec3.sub(vec3.create(), a, b)

mul = (a, b) ->
  vec3.mul(vec3.create(), a, b)

dot = (a, b) ->
  vec3.dot(a, b)

cross = (a, b) ->
  vec3.cross(vec3.create(), a, b)

scale = (a, scalar) ->
  vec3.scale(vec3.create(), a, scalar)

scaleAndAdd = (vec, scalar) ->
  vec3.scaleAndAdd(vec3.create(), vec, vec3.fromValues(1,1,1), scalar)

reflect = (vec, normal) ->
  sub(vec, scale(normal, dot(vec, normal) * 2))

Collision =

  testSphereAgainstFaces: (sphere, faces) ->
    resultingFace = {}
    any = _.any faces, (face) =>
      resultingFace = face
      @testSphereFace(sphere, face)

    { collision: any, normal: resultingFace.normal }

  testSphereFace: (sphere, face) ->
    @testSphereTriangle(sphere, face.mesh[0], face.mesh[1], face.mesh[2])

  testSphereTriangle: (sphere, a, b, c) ->
    # Find point P on triangle ABC closest to sphere center
    p = @closestPointTriangle(sphere.position, a, b, c)

    # Sphere and triangle intersect if the (squared) distance from sphere
    # center to point p is less than the (squared) sphere radius
    v = sub(p, sphere.position)

    return dot(v, v) <= (sphere.radius * sphere.radius * 1.2)

  ###
  # Referência: Real-time collision detection, Christer Ericson, 2005. Elsevier p. 139
  ###
  closestPointTriangle: (p, a, b, c) ->
    ab = sub(b, a)
    ac = sub(c, a)
    bc = sub(c, b)

    snom = dot(sub(p, a), ab)
    sdenom = dot(sub(p, b), sub(a, b))

    tnom = dot(sub(p, a), ac)
    tdenom = dot(sub(p, c), sub(a, c))

    if snom <= 0.0 && tnom <= 0.0
      return a # Vertex region early out

    unom = dot(sub(p, b), bc)
    udenom = dot(sub(p, c), sub(b, c))

    if sdenom <= 0.0 && unom <= 0.0
      return b # Vertex region early out

    if tdenom <= 0.0 && udenom <= 0.0
      return c # Vertex region early out

    n = cross(sub(b, a), sub(c, a))
    vc = dot(n, cross(sub(a, p), sub(b, p)))

    if vc <= 0.0 && snom >= 0.0 && sdenom >= 0.0
      return add(a, scale(ab, snom / (snom + sdenom)))

    va = dot(n, cross(sub(b, p), sub(c, p)))

    if va <= 0.0 && unom >= 0.0 && udenom >= 0.0
      return add(b, scale(bc, unom / (unom + udenom)))

    vb = dot(n, cross(sub(c, p), sub(a, p)))

    if vb <= 0.0 && tnom >= 0.0 && tdenom >= 0.0
      return add(a, scale(ac, tnom / (tnom + tdenom)))

    u = va / (va + vb + vc)
    v = vb / (va + vb + vc)
    w = 1.0 - u - v # = vc/(va+vb+vc)
    return add(scale(a, u), add(scale(b, v),scale(c, w)))
