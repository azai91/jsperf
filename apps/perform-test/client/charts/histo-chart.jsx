/*
  Thank you http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/
*/
var React = require('react');

module.exports = React.createClass({
  getInitialState: function(){
    if(this.props.data.length === 0) return {sorted:[]};
    return handleData(this.props);
  },componentWillReceiveProps:function(props){
    if(props.data.length === 0) return {sorted:[]};
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
  },getColor: function(){
    return {
      fill:"blue",
      stroke:"pink",
      strokeWidth:1,
      fillOpacity:0.9,
      strokeOpacity:0.9
    };
  },render: function(){
    var length = this.state.sorted.length;
    if(length === 0) return <svg></svg>;
    var histogram = [];
    var i = 0;
    var l = 0;
    var min = this.state.min;
    var segment = this.state.segment;
    var max_l = 0;
    var width = (100/length);
    var x_access = this.props.xAccessor;
    var getGroup = this.props.getGroup;
    var _this = this;
    this.state.sorted.forEach(function(data){
      var x = x_access(data);
      while(x > min+(i+1)*segment){
        if(l === 0){ i++; continue;}
        max_l = Math.max(l,max_l);
        histogram.push(<rect
          x={(i*width)+'%'} y="0" width={width+'%'} height={l}
          styles={_this.getColor(getGroup(data))}
        />);
        l = 0;
        i++;
      }
      l++;
    });
    return (<svg >{histogram}</svg>);
  }
});