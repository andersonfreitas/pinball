function ObjFile(file, name, textureName) {
  BaseObject.call(this);
  this.name = name;
  this.textureName = textureName;
  this.texture = 0;
  this.textureIndex = 0;

  Utils.loadRemoteFile(this, 'assets/obj/' + file + '.obj', this.onLoad);
}

var globalTextureCount = 0;

ObjFile.prototype = new BaseObject();

ObjFile.prototype.constructor = ObjFile;

ObjFile.prototype.onLoad = function(_, contents) {
  this.loadModelFromObj(contents, this.name);

  if (this.textureName !== undefined) {
    this.initTexture();
  }
  this.initBuffers();
};

ObjFile.prototype.initTexture = function() {
  this.texture = gl.createTexture();
  this.texture.image = new Image();

  var that = this;

  if (globalTextureCount === 0) {
    globalTextureCount = gl.TEXTURE0;
    this.textureIndex = gl.TEXTURE0;
  } else {
    this.textureIndex = globalTextureCount++;
  }

  this.texture.image.onload = function() {
     gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

     gl.bindTexture(gl.TEXTURE_2D, that.texture);
     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, that.texture.image);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
     gl.generateMipmap(gl.TEXTURE_2D);

     gl.bindTexture(gl.TEXTURE_2D, null);
  }
  this.texture.image.src = this.textureName;
}
