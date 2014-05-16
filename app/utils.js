// Math!
var π = Math.PI, τ = π * 2;

(function() {

  var Utils = { };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Utils;
    }
    exports.Utils = Utils;
  } else {
    this.Utils = Utils;
  }

  Utils.loadRemoteFile = function(context, url, callback) {
    var req = new XMLHttpRequest();

    if (req) {
      req.overrideMimeType('text/plain');
      req.onreadystatechange = function() {

        if (this.readyState == 4) {
          if (this.status == 200 || this.status === 0) {
            callback.call(context, url, this.responseText);
          } else {
            console.error('Error loading file: ' + url + ' status ' + this.status);
          }
        }
      };
      req.open('GET', url, true);
      req.send('');
    }
  };

  Utils.map = function(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
  };

  Utils.mix = function(u, v, s ) {
    if (typeof s !== 'number') {
      throw 'mix: the last parameter ' + s + ' must be a number';
    }
    if (u.length != v.length) {
      throw 'vector dimension mismatch';
    }
    var result = [];
    for (var i = 0; i < u.length; ++i) {
      result.push(s * u[i] + (1.0 - s) * v[i]);
    }
    return result;
  };

  Utils.hexToRgb = function(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: Utils.map(parseInt(result[1], 16), 0, 255, 0, 1),
      g: Utils.map(parseInt(result[2], 16), 0, 255, 0, 1),
      b: Utils.map(parseInt(result[3], 16), 0, 255, 0, 1)
    } : null;
  };

}).call(this);
