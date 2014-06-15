function ObjFile(file) {
  BaseObject.call(this);
  Utils.loadRemoteFile(this, 'assets/obj/' + file + '.obj', this.onLoad);
}

ObjFile.prototype = new BaseObject();

ObjFile.prototype.constructor = ObjFile;

ObjFile.prototype.onLoad = function(_, contents) {
  this.loadModelFromObj(contents);
  this.initBuffers();
};
