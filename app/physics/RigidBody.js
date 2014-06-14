// Generated by CoffeeScript 1.7.1
(function() {
  var RigidBody;

  RigidBody = (function() {
    function RigidBody(renderable, mass) {
      this.renderable = renderable;
      this.mass = mass;
      this.renderable;
      this.mass;
      this.velocity = vec3.create();
      this.acceleration = vec3.create();
    }

    RigidBody.prototype.applyForce = function(forceVector) {
      var force;
      force = vec3.create();
      vec3.div(force, forceVector, vec3.fromValues(this.mass, this.mass, this.mass));
      return vec3.add(this.acceleration, this.acceleration, force);
    };

    RigidBody.prototype.applyFriction = function(coeff) {
      var friction;
      friction = vec3.clone(this.velocity);
      vec3.negate(friction, friction);
      vec3.normalize(friction, friction);
      vec3.multiply(friction, friction, vec3.fromValues(coeff, coeff, coeff));
      return this.applyForce(friction);
    };

    RigidBody.prototype.update = function() {
      vec3.add(this.velocity, this.velocity, this.acceleration);
      vec3.add(this.renderable.position, this.renderable.position, this.velocity);
      return this.acceleration = vec3.create();
    };

    RigidBody.prototype.checkForCollisions = function() {
      var boundary;
      boundary = 7;
      if (this.renderable.position[0] < -boundary) {
        this.velocity[0] *= -1;
        this.renderable.position[0] = -boundary;
      } else if (this.renderable.position[0] > boundary) {
        this.velocity[0] *= -1;
        this.renderable.position[0] = boundary;
      }
      if (this.renderable.position[1] < 0) {
        this.velocity[1] *= -1;
        this.renderable.position[1] = 0;
      } else if (this.renderable.position[1] > boundary) {
        this.velocity[1] *= -1;
        this.renderable.position[1] = boundary;
      }
      if (this.renderable.position[2] < -boundary) {
        this.velocity[2] *= -1;
        return this.renderable.position[2] = -boundary;
      } else if (this.renderable.position[2] > boundary) {
        this.velocity[2] *= -1;
        return this.renderable.position[2] = boundary;
      }
    };

    return RigidBody;

  })();

  window.RigidBody = RigidBody;

}).call(this);
