var React = require('react');
var querystring = require('querystring');

console.log(querystring);


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

module.exports = React.createClass({

  getInitialState: function(){
    return null;
  },getGoogleChart:function(tests, normalize){
    console.log(platform);
    var chart_title = [
      'Operations/second on ' + platform.name,
      '(' + platform.version + ' / ' + platform.os + ')'
    ];

    var n = tests.length, markers = [], data = [];
    var d, min = 0, max = -1e10;

    // Gather test data

    tests.forEach(function(test, i) {
      if (!test.count) return;
      var hz = test.getHz();
      var v = hz != Infinity ? hz : 0;
      data.push(v);

      var label = test.name + '(' + humanize(hz)+ ')';
      var marker = 't' + escape2(label) + ',000000,0,' + i + ',10';
      max = Math.max(v, max);
      markers.push(marker);
    });

    if (markers.length <= 0) return null;

    // Build labels
    var labels = [humanize(min), humanize(max)];

    var w = 250, bw = 15;
    var bs = 5;
    var h = markers.length*(bw + bs) + 30 + chart_title.length*20;

    var params = {
      chtt: chart_title.join('|'),
      chts: '000000,10',
      cht: 'bhg',                     // chart type
      chd: 't:' + data.join(','),     // data set
      chds: min + ',' + max,          // max/min of data
      chxt: 'x',                      // label axes
      chxl: '0:|' + labels.join('|'), // labels
      chsp: '0,1',
      chm: markers.join('|'),         // test names
      chbh: [bw, 0, bs].join(','),    // bar widths
      // chf: 'bg,lg,0,eeeeee,0,eeeeee,.5,ffffff,1', // gradient
      chs: w + 'x' + h
    };

    var url = 'http://chart.apis.google.com/chart?' + join(params);

    return url;
  },render: function(){
    return <img src={this.getGoogleChart(this.props.tests, true)} />;
  }
});

function join(o, delimit1, delimit2) {
   var asQuery = !delimit1 && !delimit2;
   if (asQuery) {
     delimit1 = '&';
     delimit2 = '=';
   }

   var pairs = [];
   for (var key in o) {
     var value = o[key];
     if (asQuery) value = escape2(value);
     pairs.push(key + delimit2 + o[key]);
   }
   return pairs.join(delimit1);
 }

function escape2(s) {
  s = s.replace(/,/g, '\\,');
  s = escape(s);
  s = s.replace(/\+/g, '%2b');
  s = s.replace(/ /g, '+');
  return s;
}

// Convert x to a readable string version
function humanize(x, sd) {
  var ax = Math.abs(x), res;
  sd = sd | 4;  // significant digits
  if (ax == Infinity) {
    res = ax > 0 ? 'Infinity' : '-Infinity';
  } else if (ax > 1e9) {
    res = sig(x/1e9, sd) + 'G';
  } else if (ax > 1e6) {
    res = sig(x/1e6, sd) + 'M';
  } else if (ax > 1e3) {
    res = sig(x/1e3, sd) + 'k';
  } else if (ax > 0.01) {
    res = sig(x, sd);
  } else if (ax > 1e-3) {
    res = sig(x/1e-3, sd) + 'm';
  } else if (ax > 1e-6) {
    res = sig(x/1e-6, sd) + '\u00b5'; // Greek mu
  } else if (ax > 1e-9) {
    res = sig(x/1e-9, sd) + 'n';
  } else {
    res = x ? sig(x, sd) : 0;
  }
  // Turn values like "1.1000000000005" -> "1.1"
  res = (res + '').replace(/0{5,}\d*/, '');

  return res;
}

// Round x to d significant digits
function sig(x, d) {
  var exp = Math.ceil(Math.log(Math.abs(x))/Math.log(10)),
      f = Math.pow(10, exp-d);
  return Math.round(x/f)*f;
}