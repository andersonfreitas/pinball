var ChessPlayer = (function() {

  var gui = new dat.GUI({ autoPlace: true });

  var stats = new Stats();

  var lastTime = 0;
  var mvMatrix = mat4.create();
  var mvMatrixStack = [];
  var pMatrix = mat4.create();

  var board;
  var state;

  var tb; // track ball

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
  }

  var properties = {
    game: {
      pgn: '',
      reload: function() { positionPieces(); state.restart(board); },
      autoplay: true,
      next: function() { state.nextMove(); }
    },
    animation: {
      duration: 500,
      delay: 1000
    },
    scene: {
      projection: 'perspective',
      shadows: false,
      wireframe: false,
      lightning: true,
      resolution: 2,
      zoom: 0.500,
      diffuseLight: '#ccc'
    }
  };

  var folders = {
    game: gui.addFolder('Game'),
    scene: gui.addFolder('Scene'),
    animation: gui.addFolder('Animation')
  };

  var controllers = {
    game: {
      pgn: folders.game.add(properties.game, 'pgn'),
      reload: folders.game.add(properties.game, 'reload'),
      autoplay: folders.game.add(properties.game, 'autoplay'),
      next: folders.game.add(properties.game, 'next')
    },
    animation: {
      duration: folders.animation.add(properties.animation, 'duration'),
      delay: folders.animation.add(properties.animation, 'delay')
    },
    scene: {
      projection: folders.scene.add(properties.scene, 'projection', ['perspective', 'isometric']),
      wireframe: folders.scene.add(properties.scene, 'wireframe'),
      lightning: folders.scene.add(properties.scene, 'lightning'),
      diffuseLight: folders.scene.addColor(properties.scene, 'diffuseLight'),
      zoom: folders.scene.add(properties.scene, 'zoom', 0.2, 2).listen(),
    }
  };
  controllers.game.autoplay.onChange(function(enable) {
    if (enable)
      autoplay();
  });

  controllers.scene.lightning.onChange(function(value) {
    updateLightning(value);
  });

  controllers.scene.diffuseLight.onChange(function(value) {
    var color = Utils.hexToRgb(value);
    gl.uniform3f(currentProgram.u_DiffuseLight, color.r, color.g, color.b);
  });

  controllers.scene.projection.onChange(function(value) {
    updateProjection(value);
  });

  var scene = [];
  var game = {};

  function initScene() {
    var x = 0;
    function addToScene(object) { scene.push(object); return object; }

    var blackColor = vec4.fromValues(0.3, 0.3, 0.3, 1.0);
    var whiteColor = vec4.fromValues(1.0, 1.0, 1.0, 1.0);

    game = {
      board: addToScene(new Board()),
      base: addToScene(new BoardCube()),

      // one king, one queen, two rooks, two knights, two bishops, and eight pawns
      black: {
        king: addToScene(new ChessPiece('rei', blackColor)),
        queen: addToScene(new ChessPiece('rainha', blackColor)),
        rooks: [
          addToScene(new ChessPiece('torre', blackColor)),
          addToScene(new ChessPiece('torre', blackColor))
        ],
        knights: [
          addToScene(new ChessPiece('cavalo', blackColor)),
          addToScene(new ChessPiece('cavalo', blackColor))
        ],
        bishops: [
          addToScene(new ChessPiece('bispo', blackColor)),
          addToScene(new ChessPiece('bispo', blackColor))
        ],
        pawns: [
          addToScene(new ChessPiece('peao', blackColor)),
          addToScene(new ChessPiece('peao', blackColor)),
          addToScene(new ChessPiece('peao', blackColor)),
          addToScene(new ChessPiece('peao', blackColor)),
          addToScene(new ChessPiece('peao', blackColor)),
          addToScene(new ChessPiece('peao', blackColor)),
          addToScene(new ChessPiece('peao', blackColor)),
          addToScene(new ChessPiece('peao', blackColor))
        ]
      },

      white: {
        king: addToScene(new ChessPiece('rei', whiteColor)),
        queen: addToScene(new ChessPiece('rainha', whiteColor)),
        rooks: [
          addToScene(new ChessPiece('torre', whiteColor)),
          addToScene(new ChessPiece('torre', whiteColor))
        ],
        knights: [
          addToScene(new ChessPiece('cavalo', whiteColor)),
          addToScene(new ChessPiece('cavalo', whiteColor))
        ],
        bishops: [
          addToScene(new ChessPiece('bispo', whiteColor)),
          addToScene(new ChessPiece('bispo', whiteColor))
        ],
        pawns: [
          addToScene(new ChessPiece('peao', whiteColor)),
          addToScene(new ChessPiece('peao', whiteColor)),
          addToScene(new ChessPiece('peao', whiteColor)),
          addToScene(new ChessPiece('peao', whiteColor)),
          addToScene(new ChessPiece('peao', whiteColor)),
          addToScene(new ChessPiece('peao', whiteColor)),
          addToScene(new ChessPiece('peao', whiteColor)),
          addToScene(new ChessPiece('peao', whiteColor))
        ]
      }
    };

    positionPieces();

    return scene;
  }

  function handleFileSelect(evt) {
    var files = evt.target.files;

    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();
      reader.onload = (function(theFile) {
        return function(e) {
          loadPGNFile(e.target.result);
        };
      })(f);

      reader.readAsText(f);
    }
  }

  function initShaderVars() {
    currentProgram.vertexPositionAttribute = gl.getAttribLocation(currentProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(currentProgram.vertexPositionAttribute);

    currentProgram.vertexColorAttribute = gl.getAttribLocation(currentProgram, 'aVertexColor');
    gl.enableVertexAttribArray(currentProgram.vertexColorAttribute);

    currentProgram.vertexNormalAttribute = gl.getAttribLocation(currentProgram, 'aVertexNormal');
    gl.enableVertexAttribArray(currentProgram.vertexNormalAttribute);

    currentProgram.pMatrixUniform = gl.getUniformLocation(currentProgram, 'uPMatrix');
    currentProgram.mvMatrixUniform = gl.getUniformLocation(currentProgram, 'uMVMatrix');

    gl.useProgram(currentProgram);
    currentProgram.u_DiffuseLight = gl.getUniformLocation(currentProgram, 'u_DiffuseLight');
    currentProgram.u_LightDirection = gl.getUniformLocation(currentProgram, 'u_LightDirection');
    currentProgram.u_AmbientLight = gl.getUniformLocation(currentProgram, 'u_AmbientLight');

    var color = Utils.hexToRgb('#ccc');
    gl.uniform3f(currentProgram.u_DiffuseLight, color.r, color.g, color.b);

    var lightDirection = vec3.fromValues(1, 1, 0);
    vec3.normalize(lightDirection, lightDirection);
    gl.uniform3fv(currentProgram.u_LightDirection, _.flatten(lightDirection));

    gl.uniform3f(currentProgram.u_AmbientLight, 0.2, 0.2, 0.2);
  }

  function initLocalFileLoad() {
    $('.property-name:contains(pgn) ~ .c').html('<input type="file" id="filename" />');
    $('#filename').on('change', handleFileSelect);
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

    for (var i = scene.length - 1; i >= 0; i--) {
      obj = scene[i];

      mvPushMatrix();
      mat4.translate(mvMatrix, mvMatrix, obj.position);
      mat4.rotateY(mvMatrix, mvMatrix, obj.rotation[1]*π/180);
      setMatrixUniforms();

      obj.render();

      mvPopMatrix();
    }
  }

  function setupCameraPosition() {
    mat4.identity(mvMatrix);
    zoom = 12 * properties.scene.zoom;
    eye = vec3.fromValues(zoom, zoom, zoom);
    at = vec3.fromValues(0, 0, 0);
    up = vec3.fromValues(0, 1, 0);
    mat4.lookAt(mvMatrix, eye, at, up);
  }

  function updateAnimationTime() {
    var timeNow = new Date().getTime();
    if (lastTime !== 0) {
      var elapsed = timeNow - lastTime;

      for (var i = scene.length - 1; i >= 0; i--) {
        obj = scene[i];

        obj.updateAnimation(elapsed);
      }
    }
    lastTime = timeNow;
  }

  function autoplay() {
    state.nextMove();
    if (properties.game.autoplay)
      window.setTimeout(autoplay, properties.animation.delay);
  }

  function animate() {
    requestAnimationFrame(animate);
    stats.begin();
    render();
    updateAnimationTime();
    stats.end();
  }

  function updateLightning(enable) {
    gl.uniform1i(gl.getUniformLocation(currentProgram, 'enableLight'), enable);
  }

  function updateProjection(projection) {
    mat4.identity(pMatrix);
    var ratio = gl.viewportWidth / gl.viewportHeight;

    if (projection === 'perspective') {
      mat4.perspective(pMatrix, 45, ratio, 1, 100);
    } else {
      mat4.ortho(pMatrix, -5*ratio, 5*ratio, -5, 5, -100, 100);
    }
    setMatrixUniforms();
  }

  // Initial position,
  // first row: rook, knight, bishop, queen, king, bishop, knight, and rook;
  // second row: pawns
  function positionPieces() {
    board = {}

    var columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for (var rank = 1; rank <= 8; rank++)
      for (var file = 0; file < 8; file++)
        board[columns[file] + rank] = undefined;

    board['a1'] = game.black.rooks[0].moveTo('a1');
    board['b1'] = game.black.knights[0].moveTo('b1');
    board['c1'] = game.black.bishops[0].moveTo('c1');
    board['d1'] = game.black.queen.moveTo('d1');
    board['e1'] = game.black.king.moveTo('e1');
    board['f1'] = game.black.bishops[1].moveTo('f1');
    board['g1'] = game.black.knights[1].moveTo('g1');
    board['h1'] = game.black.rooks[1].moveTo('h1');

    for (var i = 0; i < game.black.pawns.length; i++) {
      pawn = game.black.pawns[i];
      pawn.moveTo(columns[i] + '2');
      board[columns[i] + '2'] = pawn;
    };

    // rotacionado todas as peças pretas para ficarem de frente para a camera
    _.invoke(_.flatten(ChessPlayer.game().black), 'rotate', [0, 180, 0]);
    game.black.king.rotate([0, 90, 0]);

    board['a8'] = game.white.rooks[0].moveTo('a8');
    board['b8'] = game.white.knights[0].moveTo('b8');
    board['c8'] = game.white.bishops[0].moveTo('c8');
    board['d8'] = game.white.queen.moveTo('d8');
    board['e8'] = game.white.king.moveTo('e8').rotate([0, 90, 0]);
    board['f8'] = game.white.bishops[1].moveTo('f8');
    board['g8'] = game.white.knights[1].moveTo('g8');
    board['h8'] = game.white.rooks[1].moveTo('h8');

    for (var i = 0; i < game.white.pawns.length; i++) {
      pawn = game.white.pawns[i];
      pawn.moveTo(columns[i] + '7');
      board[columns[i] + '7'] = pawn;
    }
  }

  function loadPGNFile(file) {
    positionPieces();

    state = new GameState(board);
    state.loadFromFile(file);

    if (properties.game.autoplay)
      autoplay();
  }

  function init() {
    WebGL.init();
    initStats();
    initScene();
    initShaderVars();
    initLocalFileLoad();

    loadPGNFile("1. e2-e4 e7-e5 2. g1-f3 b8-c6 3. f1-c4 f8-c5 4. b2-b4 c5-b4 5. c2-c3 b4-c5 6. e1-g1 d7-d6 7. d2-d4 e5-d4 8. c3-d4 c5-b6 9. b1-c3 c6-a5 10. c4-d3 g8-e7 11. e4-e5 d6-e5 12. d4-e5 e8-g8 13. d1-c2 h7-h6 14. c1-a3 c7-c5 15. a1-d1 c8-d7 16. e5-e6 f7-e6 17. d3-h7+ g8-h8 18. f3-e5 e7-d5 19. c3-d5 e6-d5 20. d1-d5 d7-f5 21. d5-d8 f5-c2 22. d8-f8+ a8-f8 23. h7-c2 1-0");

    setupCameraPosition();
    updateProjection('perspective');
    updateLightning(true);

    folders.game.open();
    folders.scene.open();
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

    updateProjection(properties.scene.projection);
  }

  // public methods
  return {
    init: init,
    initScene: initScene,
    scene: function() { return scene; },
    game: function() { return game; },
    properties: properties,
    state: function() { return state; },
    board: function() { return board; }
  };
})();

$(document).ready(function() {
  ChessPlayer.init();
});
