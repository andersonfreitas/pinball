function ObjFile(file, name) {
  BaseObject.call(this);
  this.name = name;
  Utils.loadRemoteFile(this, 'assets/obj/' + file + '.obj', this.onLoad);
}

ObjFile.prototype = new BaseObject();

ObjFile.prototype.constructor = ObjFile;

ObjFile.prototype.onLoad = function(_, contents) {
  this.loadModelFromObj2(contents, this.name);
  // this.loadModelFromObj(contents);
  this.initBuffers();
};
