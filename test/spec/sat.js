// http://jasmine.github.io/1.3/introduction.html

describe('OBJ Loader', function() {
  it('loads an obj with with correct count of faces', function(done) {
   var contents = "o Plane\n\
v -1.000000 0.000000 1.000000\n\
v 1.000000 0.000000 1.000000\n\
v -1.000000 0.000000 -1.000000\n\
v 1.000000 0.000000 -1.000000\n\
vt 0.000000 1.000000\n\
vt 0.000000 0.000000\n\
vt 1.000000 0.000000\n\
vt 1.000000 1.000000\n\
vn 0.000000 1.000000 0.000000\n\
s off\n\
f 1/1/1 2/2/1 4/3/1\n\
f 3/4/1 1/1/1 4/3/1";
    var obj = new BaseObject();
    obj.loadModelFromObj(contents, "Plane");

    expect(obj.faces.length).toBe(2);

    var c = new Collision();

    var face = obj.faces[0];

    var sphere1 = new Sphere(0.5, vec3.fromValues(0.0, 0.0, 0.0));
    var sphere2 = new Sphere(0.5, vec3.fromValues(0.0, 10.0, 0.0));

    // debugger
    expect(c.testSphereFace(sphere1, face)).toBe(true);
    expect(c.testSphereFace(sphere2, face)).toBe(false);

    expect(c.testSphereAgainstFaces(sphere1, obj.faces)).toBe(true);
  });
});
