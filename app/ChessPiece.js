function ChessPiece(file, color) {
  BaseObject.call(this);

  this.loaded = false;

  this.color = color;

  Utils.loadRemoteFile(this, 'assets/obj/' + file + '.obj', this.onLoad);

  this.positions = {};

  // in chess's algebraic notation: file=column & rank=row
  var files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  for (var rank = 1; rank <= 8; rank++) {
    for (var file = 0; file < 8; file++) {
      this.positions[files[file] + rank] = vec3.fromValues(rank - 0.5 - 4, 0, file + 0.5 - 4);
    }
  }
}

ChessPiece.prototype = new BaseObject();

ChessPiece.prototype.constructor = ChessPiece;

ChessPiece.prototype.onLoad = function(_, contents) {
  this.loadModelFromObj(contents);
  this.initBuffers();
  this.loaded = true;
};

ChessPiece.prototype.moveTo = function(pos) {
  this.position = this.positions[pos];
  this.positionName = pos;
  return this;
};

function lerp(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t || 0, a[1] + (b[1] - a[1]) * t || 0, a[2] + (b[2] - a[2]) * t || 0];
}

ChessPiece.prototype.animateMoveTo = function(pos, duration) {
  this.positionName = pos;
  this.animationTime = 0;
  this.destination = this.positions[pos];
  this.lastDestination = this.position;
  this.duration = duration;
  this.animating = true;
};

ChessPiece.prototype.capture = function(duration) {
  this.position[1] = 10000;
};

/**
 * Animando com uma curva bezier quadrática
 */
ChessPiece.prototype.updateAnimation = function(elapsed) {
  this.animationTime += elapsed;

  if (this.animating) {
    var delta = this.animationTime / this.duration;

    delta = Math.min(delta, 1.0);
    if (delta >= 1.0) {
      this.animating = false;
    }

    var middle = lerp(this.lastDestination, this.destination, 0.5);
    middle[1] = 3.0;

    var a = lerp(this.lastDestination, middle, delta);
    var b = lerp(middle, this.destination, delta);

    this.position = lerp(a, b, delta);
  }
};
