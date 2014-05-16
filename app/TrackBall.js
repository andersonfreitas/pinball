(function() {
  var TrackBall;
  TrackBall = (function() {
    var lastX = -1, lastY = -1;

    var dragging = false;

    var currentAngle = [0.0, 0.0];

    var canvas = 0;

    function TrackBall(canvas) {
      this.canvas = canvas;

      that = this;

      this.currentAngle = [0.0, 0.0];

      $(document).on({ "contextmenu": function(e) { e.preventDefault(); }});
      this.canvas.addEventListener("mousedown", function(ev) { that.onMouseDown(ev); }, false);
      this.canvas.addEventListener("mouseup", function(ev) { that.onMouseUp(ev); }, false);
      this.canvas.addEventListener("mousemove", function(ev) { that.onMouseMove(ev); }, false);
    }

    TrackBall.prototype.onMouseDown = function(ev) {
      this.dragging = true;

      var x = ev.clientX, y = ev.clientY;

      this.lastX = x;
      this.lastY = y;
    }

    TrackBall.prototype.onMouseUp = function(ev) {
      this.dragging = false;
    }

    TrackBall.prototype.onMouseMove = function(ev) {
      var x = ev.clientX, y = ev.clientY;

      if (this.dragging) {
        if (ev.which === 3 || ev.button === 2) {
          var factor = 100 / this.canvas.height;
          var dy = factor * (y - this.lastY) * 0.01;

          zoom = ChessPlayer.properties.scene.zoom + dy;

          ChessPlayer.properties.scene.zoom = Math.max(Math.min(zoom, 2), 0.2);
        }
        if (ev.which === 1 || ev.button === 0) {
          var factor = 100 / this.canvas.height;

          var dx = factor * (x - this.lastX);
          var dy = factor * (y - this.lastY);

          this.currentAngle[0] = this.currentAngle[0] + dy; //Math.max(Math.min(this.currentAngle[0] + dy, 90.0), -90.0);
          this.currentAngle[1] = this.currentAngle[1] + dx;
        }
      }
      this.lastX = x;
      this.lastY = y;
    }

    TrackBall.prototype.getRotation = function() {
      return this.currentAngle;
    }

    return TrackBall;
  })();
  window.TrackBall = TrackBall;
}).call(this);
