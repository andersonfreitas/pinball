(function() {
  var GameState;
  GameState = (function() {
    var board = {};
    var moves = [];
    var idx = 0;

    function GameState(board) {
      this.board = board;
      this.idx = 0;
    }

    GameState.prototype.restart = function(board) {
      this.board = board;
      this.idx = 0;
      $('.moves').children().remove();
    }

    GameState.prototype.loadFromFile = function(file) {
      parser = new PgnParser(file);
      parser.parse();
      this.moves = parser.moves;
    };

    GameState.prototype.checkMateString = function(move) {
      return (move.check ? " <strong>(check)</strong>" : "") + (move.mate ? " <strong>(CHECKMATE)</strong>" : "")
    }

    GameState.prototype.nextMove = function() {
      var move = this.moves[this.idx++];

      if (move === undefined) // fim de jogo
        return;

      var obj = this.board[move.from];

      if (this.board[move.to] !== undefined) {
        // remove a peça
        this.board[move.to].capture(ChessPlayer.properties.animation.duration);
      }

      this.board[move.from] = undefined;
      this.board[move.to] = obj;

      if (this.idx % 2 == 1) {
        $(".moves").append("<li>" + move.to + this.checkMateString(move) + "</li>");
      } else {
        $(".moves li:last").append("<span class='white-move'>" + move.to + this.checkMateString(move) + "</span>");
      }

      obj.animateMoveTo(move.to, ChessPlayer.properties.animation.duration);
    };

    return GameState;
  })();
  window.GameState = GameState;
}).call(this);
