function BaseObject() {
  this.position = vec3.create();
  this.rotation = vec3.create();

  this.vertexBuffer = 0;
  this.normalBuffer = 0;
  this.colorBuffer = 0;
  this.indexBuffer = 0;

  this.normalsBase = [];
  this.verticesBase = [];
  this.colorsBase = [];

  this.vertices = [];
  this.colors = [];
  this.normals = [];
  this.indices = [];

  this.color = vec4.fromValues(1.0, 1.0, 1.0, 1.0);

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

  // this.colorBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_.flatten(this.colors)), gl.STATIC_DRAW);
  // this.colorBuffer.itemSize = 4;
  // this.colorBuffer.numItems = this.colors.length;

  this.normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_.flatten(this.normals)), gl.STATIC_DRAW);
  this.normalBuffer.itemSize = 3;
  this.normalBuffer.numItems = this.normals.length;
};

BaseObject.prototype.loadModelFromObj2 = function(data, objName) {
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
  // return objectsMap;

  if ((selected = objectsMap[objName]) !== undefined) {
    this.indices = selected.indexes;
    this.vertices = selected.v;
    this.normals = selected.n;
    // this.texture = selected.t;
  }
};

BaseObject.prototype.loadModelFromObj = function(dados) {
  var linhas = dados.split('\n');

  var indexIndices = 0;
  for (var indice in linhas) {
    var linha = linhas[indice];
    var parte = linha.substring(0, 2);

    if (parte == 'v ') {
      var vertice = linha.match(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/);

      var vx = parseFloat(vertice[1]) * 1.3;
      var vy = parseFloat(vertice[2]) * 1.3;
      var vz = parseFloat(vertice[3]) * 1.3;

      this.verticesBase.push(vec3.fromValues(vx, vy, vz));
      this.colorsBase.push(this.color);
    } else if (parte == 'vn') {
      var normal = linha.match(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/);

      var vnx = parseFloat(normal[1]);
      var vny = parseFloat(normal[2]);
      var vnz = parseFloat(normal[3]);

      this.normalsBase.push(vec3.fromValues(vnx, vny, vnz));
    } else if (parte == 'f ') {
      var indices0 = (linha.substring(2)).split(' ');

      var i1 = parseInt((indices0[0].substring(0)).split('//')[0]);
      var i2 = parseInt((indices0[1].substring(0)).split('//')[0]);
      var i3 = parseInt((indices0[2].substring(0)).split('//')[0]);

      this.indices.push(indexIndices++, indexIndices++, indexIndices++);
      // this.indices.push(i1 - 1, i2 - 1, i3 - 1);

      this.vertices.push(this.verticesBase[i1 - 1], this.verticesBase[i2 - 1], this.verticesBase[i3 - 1]);
      this.colors.push(this.colorsBase[i1 - 1], this.colorsBase[i2 - 1], this.colorsBase[i3 - 1]);

      var in1 = parseInt((indices0[0].substring(0)).split('//')[1]);
      var in2 = parseInt((indices0[1].substring(0)).split('//')[1]);
      var in3 = parseInt((indices0[2].substring(0)).split('//')[1]);
      // this.indicesNormal.push(in1 - 1, in2 - 1, in3 - 1);

      this.normals.push(this.normalsBase[in1 - 1], this.normalsBase[in2 - 1], this.normalsBase[in3 - 1]);
    }
  }
};

BaseObject.prototype.render = function() {
  if (this.vertexBuffer === 0)
    return;

  // gl.depthMask(false);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.vertexAttribPointer(currentProgram.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  // gl.vertexAttribPointer(currentProgram.vertexColorAttribute, this.colorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
  gl.vertexAttribPointer(currentProgram.vertexNormalAttribute, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

  if (Pinball.properties.scene.wireframe) {
    gl.drawElements(gl.LINE_STRIP, this.indices.length, gl.UNSIGNED_SHORT, 0);
  } else {
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
  }
};
