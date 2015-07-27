/*
  Thank you http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/
*/
var React = require('react');

module.exports = React.createClass({
  getInitialState: function(){
    if(!this.props.data || this.props.data.length === 0) return {sorted:[]};
    return this.handleData(this.props);
  },componentWillReceiveProps:function(props){
    if(!this.props.data || props.data.length === 0) return;
    return this.setState(this.handleData(props));
  },handleData:function(props){
    var x_access = props.xAccessor;
    var sorted = props.data.sort(function(a,b){
      return x_access(a) - x_access(b);
    });
    var l = sorted.length;
    var min = x_access(sorted[0]);
    var max = x_access(sorted[l-1]);
    var median = x_access(sorted[Math.ceil(l/2)-1]);
    var mean = sorted.reduce(function(a,b){ return a + x_access(b)/l; },0);
    var segment = (max - min)/l;
    return {
      sorted: sorted,
      min: min,
      max: max,
      median: median,
      mean: mean,
      segment: segment
    };
  },shouldComponentUpdate: function(nextProps, nextState) {
    if(!nextProps.data || nextProps.data.length === 0) return false;
    var state = this.handleData(nextProps);
    var histogram = [];
    var i = 0, l = 0, ii = 0, ll;
    var min = state.min;
    var segment = state.segment;
    var max_l = 0;
    var width = (100/length);
    var x_access = this.props.xAccessor;
    var group_access = this.props.groupAccessor;
    var groupedLengths = {};
    var x_axis = ['x',min];
    state.sorted.forEach(function(data){
      var group = group_access(data);
      if(!(group in groupedLengths)){
        groupedLengths[group] = {
          name:group,
          ret:[group],
          current: 0
        };
        ii=0;
        while(ii < i){
          groupedLengths[group].ret.push(0);
          ii++;
        }
      }
      var x = x_access(data);
      while(x > min+(i+1)*segment){
        x_axis.push(min+(i+1)*segment);
        var curkeys = Object.keys(groupedLengths);
        for(ii=0,ll=curkeys.length; ii < ll; ii++){
          var groupname = curkeys[ii];
          groupedLengths[groupname].ret.push(groupedLengths[groupname].current);
          groupedLengths[groupname].current = 0;
        }
        i++;
      }
      groupedLengths[group].current++;
    });
    var gnames = Object.keys(groupedLengths);
    var data = gnames.map(function(groupname){
      groupedLengths[groupname].ret.push(groupedLengths[groupname].current);
      while(groupedLengths[groupname].ret.length < i) groupedLengths[groupname].ret.push(0);
      return groupedLengths[groupname].ret;
    });
    x_axis.push(min+(i+1)*segment);
    data.push(x_axis);
    this.chart.load({
      columns: data
    });
//    this.chart.groups([gnames]);
    return false;
  },render: function(){
    return <div></div>;
  },componentDidMount: function(){
    this.chart = c3.generate({
      bindto: React.findDOMNode(this),
      data: { x: 'x', columns: [['x']] },
      axis : {
        x : {
          type : 'indexed',
          tick: {
            format: function (x) {
              var ax = Math.abs(x), res;
              sd = 0 | 4;  // significant digits
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
          }
        }
      }
    });
  }
});

// Round x to d significant digits
function sig(x, d) {
  var exp = Math.ceil(Math.log(Math.abs(x))/Math.log(10)),
      f = Math.pow(10, exp-d);
  return Math.round(x/f)*f;
}