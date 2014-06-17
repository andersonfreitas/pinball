function BaseObject() {
  this.position = vec3.create();
  this.rotation = vec3.create();

  this.vertexBuffer = 0;
  this.normalBuffer = 0;
  this.textureBuffer = 0;
  this.indexBuffer = 0;

  this.vertices = [];
  this.normals = [];
  this.indices = [];
  this.textureCoords = [];

  this.animationTime = 0;
}

BaseObject.prototype.updatePosition = function(x, y, z) {
  this.position = vec3.fromValues(x, y, z);
  return this;
}


BaseObject.prototype.rotate = function(rotation) {
  this.rotation = rotation;
  return this;
};

BaseObject.prototype.updateAnimation = function(elapsed) {
  this.animationTime += elapsed;
};

BaseObject.prototype.initBuffers = function() {
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_.flatten(this.vertices)), gl.STATIC_DRAW);
  this.vertexBuffer.itemSize = 3;
  this.vertexBuffer.numItems = this.vertices.length;

  this.textureBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_.flatten(this.textureCoords)), gl.STATIC_DRAW);
  this.textureBuffer.itemSize = 2;
  this.textureBuffer.numItems = this.textureCoords.length;

  this.normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_.flatten(this.normals)), gl.STATIC_DRAW);
  this.normalBuffer.itemSize = 3;
  this.normalBuffer.numItems = this.normals.length;
};

BaseObject.prototype.loadModelFromObj = function(data, objName) {
  var lines = data.split("\n");

  var vArr = []; // vertex array
  var nArr = []; // normal array
  var tArr = []; // texture
  var fArr = []; // face array
  var objectsMap = {};
  var objAttributes = {};
  objAttributes.v = [];
  objAttributes.n = [];
  objAttributes.t = [];
  objAttributes.hashIndexes = {};
  objAttributes.indexes = [];
  objAttributes.index = 0;

  var lastObjName = "";
  for (var i = 0; i < lines.length; i++){
    var line = lines[i].split(" ");
    switch (line[0]){
      case "o":
        // do some processing with the "past" value of lastObjName, before setting lastObjName with the actual object name
        if (lastObjName != ""){
          /* this will be executed only if there are 2 or more objects in the file */
          objectsMap[lastObjName] = objAttributes;
        }
        /* resets the variables */
        vArr = [];
        nArr = [];
        tArr = [];
        objAttributes = {};
        objAttributes.v = [];
        objAttributes.n = [];
        objAttributes.t = [];
        objAttributes.hashIndexes = {};
        objAttributes.indexes = [];
        objAttributes.index = 0;

        lastObjName = line[1];
        break;
      case "v":
        vArr.push(parseFloat(line[1]), parseFloat(line[2]), parseFloat(line[3]));
        break;
      case "vn":
        nArr.push(parseFloat(line[1]), parseFloat(line[2]), parseFloat(line[3]));
        break;
      case "vt":
        tArr.push(parseFloat(line[1]), parseFloat(line[2]));
        break;
      case "f":
        for(var j = 1; j < line.length; j++){
          /* reuses the repeated faces */
          if (line[j] in objAttributes.hashIndexes){
            objAttributes.indexes.push(parseInt(objAttributes.hashIndexes[line[j]]));
          }
          else{
            var vtn = line[j].split("/"); // splits the face coordinate, store as v/vt/vn
            /* position vertex */
            objAttributes.v.push(vArr[(parseInt(vtn[0])-1)*3 + 0]);
            objAttributes.v.push(vArr[(parseInt(vtn[0])-1)*3 + 1]);
            objAttributes.v.push(vArr[(parseInt(vtn[0])-1)*3 + 2]);

            /* texture vertex */
            objAttributes.t.push(tArr[(parseInt(vtn[1])-1)*2 + 0]);
            objAttributes.t.push(tArr[(parseInt(vtn[1])-1)*2 + 1]);

            /* normal vertex */
            objAttributes.n.push(nArr[(parseInt(vtn[2])-1)*3 + 0]);
            objAttributes.n.push(nArr[(parseInt(vtn[2])-1)*3 + 1]);
            objAttributes.n.push(nArr[(parseInt(vtn[2])-1)*3 + 2]);

            objAttributes.hashIndexes[line[j]] = objAttributes.index;
            objAttributes.indexes.push(objAttributes.index);
            objAttributes.index += 1;
          }
        }
        break;
    }
  }
  objectsMap[lastObjName] = objAttributes; // adds the last object in the file

  if ((selected = objectsMap[objName]) !== undefined) {
    this.indices = selected.indexes;
    this.vertices = selected.v;
    this.normals = selected.n;
    this.textureCoords = selected.t;

    this.faces = [];
    for (var i = 0; i < objAttributes.indexes.length; i+=3) {
      var index = objAttributes.indexes[i];

      this.faces.push({
          mesh: [
            vec3.fromValues(
              selected.v[(objAttributes.indexes[i + 0] * 3) + 0],
              selected.v[(objAttributes.indexes[i + 0] * 3) + 1],
              selected.v[(objAttributes.indexes[i + 0] * 3) + 2]
            ),
            vec3.fromValues(
              selected.v[(objAttributes.indexes[i + 1] * 3) + 0],
              selected.v[(objAttributes.indexes[i + 1] * 3) + 1],
              selected.v[(objAttributes.indexes[i + 1] * 3) + 2]
            ),
            vec3.fromValues(
              selected.v[(objAttributes.indexes[i + 2] * 3) + 0],
              selected.v[(objAttributes.indexes[i + 2] * 3) + 1],
              selected.v[(objAttributes.indexes[i + 2] * 3) + 2]
            )],
          normal: vec3.fromValues(
            selected.n[(objAttributes.indexes[i + 0] * 3) + 0],
            selected.n[(objAttributes.indexes[i + 0] * 3) + 1],
            selected.n[(objAttributes.indexes[i + 0] * 3) + 2]
            )
        }
      );
    };

    // this.face_normals = [];
  }
};

BaseObject.prototype.render = function() {
  if (this.vertexBuffer === 0)
    return;

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.vertexAttribPointer(currentProgram.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
  gl.vertexAttribPointer(currentProgram.vertexNormalAttribute, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
  gl.vertexAttribPointer(currentProgram.textureCoordAttribute, this.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // gl.activeTexture(this.textureIndex);
  gl.bindTexture(gl.TEXTURE_2D, this.texture);
  gl.uniform1i(currentProgram.samplerUniform, 0);

  if (Pinball.properties.scene.wireframe) {
    gl.drawElements(gl.LINE_STRIP, this.indices.length, gl.UNSIGNED_SHORT, 0);
  } else {
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
  }
};
