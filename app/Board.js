function Board() {
  BaseObject.call(this);

  this.position = vec3.fromValues(-4, 0, -4);
  this.createBoard();
  this.initBuffers();
}

Board.prototype = new BaseObject();
Board.prototype.constructor = Board;

Board.prototype.createBoard = function() {
  var color;
  function cycleColors(a, b) {
    color = (color !== a) ? a : b;
  }

  for (var i = 0; i < 8; i++) {
    cycleColors('white', 'black');
    for (var j = 0; j < 8; j++) {
      cycleColors('white', 'black');
      this.createSquare(i, j, color);
    }
  }
};

Board.prototype.createSquare = function(posX, posZ, color) {
  this.vertices.push(
    vec3.fromValues(0 + posX, 0, 1 + posZ), // a
    vec3.fromValues(0 + posX, 0, 0 + posZ), // b
    vec3.fromValues(1 + posX, 0, 1 + posZ), // c
    vec3.fromValues(1 + posX, 0, 0 + posZ)  // d
  );

  var l = this.vertices.length - 4;
  this.indices.push(
    l + 0, l + 1, l + 2,
    l + 1, l + 3, l + 2
  );

  squareColor = (color == 'black') ? vec4.fromValues(0, 0, 0, 1) : vec4.fromValues(1, 1, 1, 1);
  this.colors.push(squareColor, squareColor, squareColor, squareColor);

  var up = vec3.fromValues(0, 1, 0);
  this.normals.push(
    up, up, up, up
  );
};
