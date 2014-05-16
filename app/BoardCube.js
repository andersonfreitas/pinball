function BoardCube() {
  BaseObject.call(this);

  this.position = vec3.fromValues(-4, 1, -4);
  this.createBoardCube();
  this.initBuffers();
}

BoardCube.prototype = new BaseObject();
BoardCube.prototype.constructor = BoardCube;

BoardCube.prototype.createBoardCube = function() {
  this.createSquare();
};

BoardCube.prototype.createSquare = function() {
  this.vertices.push(
    // top
    vec3.fromValues(0, -1.5, 8), // 0
    vec3.fromValues(0, -1.5, 0), // 1
    vec3.fromValues(8, -1.5, 8), // 2
    vec3.fromValues(8, -1.5, 0), // 3


    vec3.fromValues(8, -1, 8), // 4
    vec3.fromValues(0, -1, 8), // 5
    vec3.fromValues(0, -1, 0), // 6
    vec3.fromValues(8, -1, 0)  // 7
  );

  var l = this.vertices.length - 4;
  this.indices.push(
    // top
    0, 1, 2,
    1, 3, 2,

    // left
    2, 0, 4,
    4, 0, 5,

    // back
    5, 0, 6,
    6, 1, 0,

    // right
    6, 1, 3,
    6, 7, 3,

    // front
    3, 4, 2,
    4, 3, 7
  );

  squareColor = vec4.fromValues(0, 0, 0, 1);
  this.colors.push(squareColor, squareColor, squareColor, squareColor, squareColor, squareColor,squareColor, squareColor,squareColor, squareColor);

  var up = vec3.fromValues(0, 1, 0);
  var right = vec3.fromValues(-1, 0, 0);
  var left = vec3.fromValues(1, 0, 0);
  this.normals.push(
    up, up, up, up, right, right, right, right
  );
};
