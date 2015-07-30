

// figures out platform information
var platform = (function(root) {
  // Platform info object
  var p = {
    name: null,
    version: null,
    os: null,
    description: 'unknown platform',
    toString: function() {return this.description;}
  };

  if (root.navigator) {
    var ua = navigator.userAgent;

    // Detect OS
    var oses = 'Windows|iPhone OS|(?:Intel |PPC )?Mac OS X|Linux';
    p.os = new RegExp('((' + oses + ') +[^ \);]*)').test(ua) ? RegExp.$1.replace(/_/g, '.') : null;

    // Detect expected names
    p.name = /(Chrome|MSIE|Safari|Opera|Firefox|Minefield)/.test(ua) ? RegExp.$1 : null;

    // Detect version
    if (p.name == 'Opera') {
      p.version = opera.name;
    } else if (p.name) {
      var vre = new RegExp('(Version|' + p.name + ')[ \/]([^ ;]*)');
      p.version = vre.test(ua) ? RegExp.$2 : null;
    }
  } else if (root.process && process.platform) {
    // Support node.js (see http://nodejs.org)
    p.name = 'node';
    p.version = process.version;
    p.os = process.platform;
  }

  // Set the description
  var d = [];
  if (p.name) d.push(p.name);
  if (p.version) d.push(' ' + p.version);
  if (p.os) d.push(' on ' + p.os);
  if (d.length) p.description = d.join('');

  return p;
})(typeof window!=="undefined"?window:typeof global!=="undefined"?global:this);

module.exports = platform;
