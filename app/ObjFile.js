function ObjFile(file, name) {
  BaseObject.call(this);
  this.name = name;
  Utils.loadRemoteFile(this, 'assets/obj/' + file + '.obj', this.onLoad);
}

ObjFile.prototype = new BaseObject();

ObjFile.prototype.constructor = ObjFile;

ObjFile.prototype.onLoad = function(_, contents) {
  this.loadModelFromObj(contents, this.name);
  this.initBuffers();
};
