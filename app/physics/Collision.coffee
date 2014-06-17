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

Collision =

  testSphereAgainstFaces: (sphere, faces) ->
    _.any faces, (face) =>
      @testSphereFace(sphere, face)

  testSphereFace: (sphere, face) ->
    @testSphereTriangle(sphere, face[0], face[1], face[2])

  testSphereTriangle: (sphere, a, b, c) ->
    # Find point P on triangle ABC closest to sphere center
    p = @closestPointTriangle(sphere.position, a, b, c)

    # Sphere and triangle intersect if the (squared) distance from sphere
    # center to point p is less than the (squared) sphere radius
    v = sub(p, sphere.position)

    return dot(v, v) <= sphere.radius * sphere.radius

  closestPointFace: (p, face) ->
    @closestPointTriangle(p, face[0], face[1], face[2])

  closestPointTriangle: (p, a, b, c) ->
    ab = sub(b, a)
    ac = sub(c, a)
    bc = sub(c, b)

    # Compute parametric position s for projection P’ of P on AB,
    # P’ = A + s*AB, s = snom/(snom+sdenom)
    snom = dot(sub(p, a), ab)
    sdenom = dot(sub(p, b), sub(a, b))

    # Compute parametric position t for projection P’ of P on AC,
    # P’ = A + t*AC, s = tnom/(tnom+tdenom)
    tnom = dot(sub(p, a), ac)
    tdenom = dot(sub(p, c), sub(a, c))

    if snom <= 0.0 && tnom <= 0.0
      return a # Vertex region early out

    # Compute parametric position u for projection P’ of P on BC,
    # P’ = B + u*BC, u = unom/(unom+udenom)
    unom = dot(sub(p, b), bc)
    udenom = dot(sub(p, c), sub(b, c))

    if sdenom <= 0.0 && unom <= 0.0
      return b # Vertex region early out

    if tdenom <= 0.0 && udenom <= 0.0
      return c # Vertex region early out

    # P is outside (or on) AB if the triple scalar product [N PA PB] <= 0
    n = cross(sub(b, a), sub(c, a))
    vc = dot(n, cross(sub(a, p), sub(b, p)))

    # If P outside AB and within feature region of AB,
    # return projection of P onto AB
    if vc <= 0.0 && snom >= 0.0 && sdenom >= 0.0
      return add(a, scale(ab, snom / (snom + sdenom)))

    # P is outside (or on) BC if the triple scalar product [N PB PC] <= 0
    va = dot(n, cross(sub(b, p), sub(c, p)))

    # If P outside BC and within feature region of BC,
    # return projection of P onto BC
    if va <= 0.0 && unom >= 0.0 && udenom >= 0.0
      return add(b, scale(bc, unom / (unom + udenom)))

    # P is outside (or on) CA if the triple scalar product [N PC PA] <= 0
    vb = dot(n, cross(sub(c, p), sub(a, p)))

    # If P outside CA and within feature region of CA,
    # return projection of P onto CA
    if vb <= 0.0 && tnom >= 0.0 && tdenom >= 0.0
      return add(a, scale(ac, tnom / (tnom + tdenom)))

    # P must project inside face region. Compute Q using barycentric coordinates
    u = va / (va + vb + vc)
    v = vb / (va + vb + vc)
    w = 1.0 - u - v # = vc/(va+vb+vc)
    return add(scale(a, u), add(scale(b, v),scale(c, w)))
