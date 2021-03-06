// Generated by CoffeeScript 1.7.1
this.Audio = (function() {
  function _Class() {
    this.effects = {};
    this.loadEffect('chomp');
    this.loadEffect('death');
    this.loadEffect('flipper');
    this.loadEffect('start');
  }

  _Class.prototype.loadEffect = function(name) {
    this.effects[name] = document.createElement('audio');
    this.effects[name].setAttribute('src', "assets/audio/" + name + ".wav");
    this.effects[name].setAttribute('preload', 'auto');
    return this.effects[name].sing = (function(_this) {
      return function() {
        if (Pinball.properties.scene.audio) {
          return _this.effects[name].play();
        }
      };
    })(this);
  };

  return _Class;

})();

//# sourceMappingURL=Audio.map
