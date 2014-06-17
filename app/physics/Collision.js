// Generated by CoffeeScript 1.7.1
var add, cross, dot, mul, scale, scaleAndAdd, sub;

this.Sphere = (function() {
  function _Class(radius, position) {
    this.radius = radius;
    this.position = position;
  }

  return _Class;

})();

add = function(a, b) {
  return vec3.add(vec3.create(), a, b);
};

sub = function(a, b) {
  return vec3.sub(vec3.create(), a, b);
};

mul = function(a, b) {
  return vec3.mul(vec3.create(), a, b);
};

dot = function(a, b) {
  return vec3.dot(a, b);
};

cross = function(a, b) {
  return vec3.cross(vec3.create(), a, b);
};

scale = function(a, scalar) {
  return vec3.scale(vec3.create(), a, scalar);
};

scaleAndAdd = function(vec, scalar) {
  return vec3.scaleAndAdd(vec3.create(), vec, vec3.fromValues(1, 1, 1), scalar);
};

this.Collision = (function() {
  function _Class() {}

  _Class.prototype.testSphereFace = function(sphere, face) {
    return this.testSphereTriangle(sphere, face[0], face[1], face[2]);
  };

  _Class.prototype.testSphereTriangle = function(sphere, a, b, c) {
    var p, v;
    p = this.closestPointTriangle(sphere.position, a, b, c);
    v = sub(p, sphere.position);
    return dot(v, v) <= sphere.radius * sphere.radius;
  };

  _Class.prototype.closestPointFace = function(p, face) {
    return this.closestPointTriangle(p, face[0], face[1], face[2]);
  };

  _Class.prototype.closestPointTriangle = function(p, a, b, c) {
    var ab, ac, bc, n, sdenom, snom, tdenom, tnom, u, udenom, unom, v, va, vb, vc, w;
    ab = sub(b, a);
    ac = sub(c, a);
    bc = sub(c, b);
    snom = dot(sub(p, a), ab);
    sdenom = dot(sub(p, b), sub(a, b));
    tnom = dot(sub(p, a), ac);
    tdenom = dot(sub(p, c), sub(a, c));
    if (snom <= 0.0 && tnom <= 0.0) {
      return a;
    }
    unom = dot(sub(p, b), bc);
    udenom = dot(sub(p, c), sub(b, c));
    if (sdenom <= 0.0 && unom <= 0.0) {
      return b;
    }
    if (tdenom <= 0.0 && udenom <= 0.0) {
      return c;
    }
    n = cross(sub(b, a), sub(c, a));
    vc = dot(n, cross(sub(a, p), sub(b, p)));
    if (vc <= 0.0 && snom >= 0.0 && sdenom >= 0.0) {
      return add(a, scale(ab, snom / (snom + sdenom)));
    }
    va = dot(n, cross(sub(b, p), sub(c, p)));
    if (va <= 0.0 && unom >= 0.0 && udenom >= 0.0) {
      return add(b, scale(bc, unom / (unom + udenom)));
    }
    vb = dot(n, cross(sub(c, p), sub(a, p)));
    if (vb <= 0.0 && tnom >= 0.0 && tdenom >= 0.0) {
      return add(a, scale(ac, tnom / (tnom + tdenom)));
    }
    u = va / (va + vb + vc);
    v = vb / (va + vb + vc);
    w = 1.0 - u - v;
    return add(scale(a, u), add(scale(b, v), scale(c, w)));
  };

  return _Class;

})();

//# sourceMappingURL=Collision.map
