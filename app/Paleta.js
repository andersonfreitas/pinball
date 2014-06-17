// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Paleta = (function(_super) {
    __extends(_Class, _super);

    function _Class() {
      _Class.__super__.constructor.call(this, 'paleta-esq2', 'paleta-esq_Mesh.010', 'assets/images/madeira.jpg');
      this.animating = false;
    }

    _Class.prototype.animate = function(duration) {
      this.duration = duration != null ? duration : 1000;
      this.animationTime = 0;
      this.animating = true;
      return this.rotation = vec3.create();
    };

    _Class.prototype.updateAnimation = function(elapsed) {
      var a, b, delta, rot;
      this.animationTime += elapsed;
      if (this.animating) {
        delta = this.animationTime / this.duration;
        delta = Math.min(delta, 1.0);
        if (delta >= 1.0) {
          this.animating = false;
        }
        a = this.lerp(0, 60, delta);
        b = this.lerp(60, 0, delta);
        rot = this.lerp(a, b, delta);
        return this.rotation = vec3.fromValues(0, rot, 0);
      }
    };

    _Class.prototype.lerp = function(a, b, t) {
      return a + (b - a) * t || 0;
    };

    return _Class;

  })(ObjFile);

}).call(this);

//# sourceMappingURL=Paleta.map
