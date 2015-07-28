var d3 = require('d3');

var d3Chart = {};

d3Chart.create = function(el, props, state) {
  var svg = d3.select(el).append('svg')
      .attr('class', 'd3')
      .attr('width', props.width)
      .attr('height', props.height);

  // So we will not always be doing points
  svg.append('g')
      .attr('class', 'd3-points');

  this.update(el, state);
};

d3Chart.update = function(el, state) {
  var scales = this._scales(el, state.domain);
  this._drawPoints(el, scales, state.data);
};

d3Chart.destroy = function(el) {};

module.exports = d3Chart;