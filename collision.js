var Pinball = (function() {

  var gui = new dat.GUI({ autoPlace: true });

  var stats = new Stats();

  var lastTime = 0;
  var mvMatrix = mat4.create();
  var mvMatrixStack = [];
  var pMatrix = mat4.create();
  var tb;

  function mvPushMatrix() {
    var copy = mat4.create();
    mat4.copy(copy, mvMatrix);
    mvMatrixStack.push(copy);
  }

  function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
      throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
  }

  function setMatrixUniforms() {
    gl.uniformMatrix4fv(currentProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(currentProgram.mvMatrixUniform, false, mvMatrix);

    invert = mat4.invert(mat4.create(), mvMatrix);
    normalmatrix = mat4.transpose(mat4.create(), invert);
    gl.uniformMatrix4fv(currentProgram.normalMat, false, normalmatrix);
  }

  var properties = {
    scene: {
      shadows: false,
      wireframe: false,
      lightning: true,
      zoom: 0.1,
      diffuseLight: '#ccc'
    }
  };

  var folders = {
    scene: gui.addFolder('Scene')
  };

  var controllers = {
    scene: {
      wireframe: folders.scene.add(properties.scene, 'wireframe'),
      lightning: folders.scene.add(properties.scene, 'lightning'),
      diffuseLight: folders.scene.addColor(properties.scene, 'diffuseLight'),
      zoom: folders.scene.add(properties.scene, 'zoom', 0, 8.0).listen(),
    }
  };

  controllers.scene.lightning.onChange(function(value) {
    updateLightning(value);
  });

  controllers.scene.diffuseLight.onChange(function(value) {
    var color = Utils.hexToRgb(value);
    gl.uniform3f(currentProgram.u_DiffuseLight, color.r, color.g, color.b);
  });

  function initShaderVars() {
    currentProgram.vertexPositionAttribute = gl.getAttribLocation(currentProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(currentProgram.vertexPositionAttribute);

    currentProgram.vertexNormalAttribute = gl.getAttribLocation(currentProgram, 'aVertexNormal');
    gl.enableVertexAttribArray(currentProgram.vertexNormalAttribute);

    currentProgram.textureCoordAttribute = gl.getAttribLocation(currentProgram, "aTextureCoord");
    gl.enableVertexAttribArray(currentProgram.textureCoordAttribute);

    currentProgram.pMatrixUniform = gl.getUniformLocation(currentProgram, 'uPMatrix');
    currentProgram.mvMatrixUniform = gl.getUniformLocation(currentProgram, 'uMVMatrix');
    currentProgram.normalMat = gl.getUniformLocation(currentProgram, 'normalMat');

    gl.useProgram(currentProgram);
    currentProgram.u_DiffuseLight = gl.getUniformLocation(currentProgram, 'u_DiffuseLight');
    currentProgram.u_LightDirection = gl.getUniformLocation(currentProgram, 'u_LightDirection');
    currentProgram.u_AmbientLight = gl.getUniformLocation(currentProgram, 'u_AmbientLight');

    var color = Utils.hexToRgb('#ccc');
    gl.uniform3f(currentProgram.u_DiffuseLight, color.r, color.g, color.b);

    var lightDirection = vec3.fromValues(5, 5, 5);
    vec3.normalize(lightDirection, lightDirection);
    gl.uniform3fv(currentProgram.u_LightDirection, _.flatten(lightDirection));

    gl.uniform3f(currentProgram.u_AmbientLight, 0.2, 0.2, 0.2);
  }

  function initStats() {
    stats.setMode(0); // 0: fps, 1: ms
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild(stats.domElement);
  }

  function render() {
    if (!currentProgram)
      return;

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(currentProgram);

    setupCameraPosition();

    mat4.rotateX(mvMatrix, mvMatrix, tb.getRotation()[0]*π/180);
    mat4.rotateY(mvMatrix, mvMatrix, tb.getRotation()[1]*π/180);

    for (var i = sceneGraph.length - 1; i >= 0; i--) {
      obj = sceneGraph[i];

      mvPushMatrix();

      mat4.translate(mvMatrix, mvMatrix, obj.position);
      mat4.rotateX(mvMatrix, mvMatrix, obj.rotation[0]*π/180);
      mat4.rotateY(mvMatrix, mvMatrix, obj.rotation[1]*π/180);
      mat4.rotateZ(mvMatrix, mvMatrix, obj.rotation[2]*π/180);

      setMatrixUniforms();

      obj.render();

      mvPopMatrix();
    }
  }

  function updateLightning(enable) {
    gl.uniform1i(gl.getUniformLocation(currentProgram, 'enableLight'), enable);
  }

  function updateProjection() {
    mat4.identity(pMatrix);
    var ratio = gl.viewportWidth / gl.viewportHeight;

    mat4.perspective(pMatrix, 45, ratio, 0.01, 100);
    setMatrixUniforms();
  }

  function init() {
    WebGL.init();
    initStats();
    initScene();
    initShaderVars();

    updateLightning(true);

    setupCameraPosition();
    // updateProjection();

    // folders.scene.open();

    onWindowResize();
    window.addEventListener('resize', _.debounce(onWindowResize, 300, false), false);

    tb = new TrackBall(WebGL.getCanvas());

    animate();
  }

  function onWindowResize(event) {
    var canvas = WebGL.getCanvas();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    updateProjection();
  }

  function setupCameraPosition() {
    mat4.identity(mvMatrix);
    zoom = 12 * properties.scene.zoom;
    eye = vec3.fromValues(0.02323, 0.88135, -0.8366);
    at = vec3.fromValues(0.0, 0.0, 0.0);
    up = vec3.fromValues(0, 1, 0);
    mat4.lookAt(mvMatrix, eye, at, up);
  }

  function updateAnimationTime() {
    var timeNow = new Date().getTime();
    if (lastTime !== 0) {
      var elapsed = timeNow - lastTime;

      for (var i = sceneGraph.length - 1; i >= 0; i--) {
        obj = sceneGraph[i];
        obj.updateAnimation(elapsed);
      }
    }
    lastTime = timeNow;
  }

  var x = 0.4;

  function animate() {
    requestAnimationFrame(animate);
    stats.begin();

    var gravity = vec3.fromValues(0, -9.81 /* m^s */, 0);

    for (var i = 0; i < dynamicSpheres.length; i++) {
      obj = dynamicSpheres[i];

      // obj.applyForce(wind);
      obj.checkForCollisions(1/10, staticObjects, dynamicSpheres);
      obj.applyForce(gravity);
      obj.update(1/30);
    };

    updateAnimationTime();
    render();

    stats.end();
  }

  var sceneGraph = [];
  var dynamicSpheres = [];
  var staticObjects = [];
  var objects = {}

  function initScene() {
    function addToScene(object) { sceneGraph.push(object); return object; }

    objects.esfera = new Sphere(0.015)
    addToScene(objects.esfera);
    objects.esfera.updatePosition(0.0, 0.5, 0.0)

    dynamicSpheres.push(new RigidBody(objects.esfera, 10.0));

    objects.chao = new ObjFile('untitled', 'Plane', 'assets/images/ground.jpg')
    addToScene(objects.chao);
    staticObjects.push(objects.chao);

    return sceneGraph;
  }

  // public methods
  return {
    init: init,
    initScene: initScene,
    properties: properties,
    objects: objects,
    sceneGraph: sceneGraph,
    dynamicSpheres: dynamicSpheres
  };
})();

$(document).ready(function() {
  Pinball.init();
});
