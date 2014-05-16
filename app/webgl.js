var gl;
var currentProgram;

var WebGL = (function() {
  var canvas;
  var vertexShader, fragmentShader;

  function initWebGL() {
    glMatrix.setMatrixArrayType(Array);

    canvas = document.querySelector('canvas');

    try {
      gl = canvas.getContext('experimental-webgl');
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;
    } catch (error) {
      console.error(error);
    }
    if (!gl) {
      console.error('cannot create webgl context');
    }

    currentProgram = initShaders('assets/shaders/shader.vsh', 'assets/shaders/shader.fsh');

    gl.clearColor(0.98, 0.98, 0.98, 1.0);
    gl.enable(gl.DEPTH_TEST);
  }

  function loadFileAJAX(name) {
      var xhr = new XMLHttpRequest(),
          okStatus = document.location.protocol === 'file:' ? 0 : 200;
      xhr.open('GET', name, false);
      xhr.send(null);
      return xhr.status == okStatus ? xhr.responseText : null;
  }

  function initShaders(vShaderName, fShaderName) {
      function getShader(shaderName, type) {
          var shader = gl.createShader(type),
              shaderScript = loadFileAJAX(shaderName);
          if (!shaderScript) {
              alert('Could not find shader source: ' + shaderName);
          }
          gl.shaderSource(shader, shaderScript);
          gl.compileShader(shader);

          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
              alert(gl.getShaderInfoLog(shader));
              return null;
          }
          return shader;
      }
      var vertexShader = getShader(vShaderName, gl.VERTEX_SHADER),
          fragmentShader = getShader(fShaderName, gl.FRAGMENT_SHADER),
          program = gl.createProgram();

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          alert('Could not initialise shaders');
          return null;
      }
      return program;
  }

  function getCanvas() { return canvas; }

  return {
    init: initWebGL,
    getCanvas: getCanvas
  };
})();
