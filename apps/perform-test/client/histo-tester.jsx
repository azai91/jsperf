var React = require('react');
var Chart = require('./charts/c3-chart');
var runTests = require('../shared/run-tests');
var async = require('async');

module.exports = React.createClass({
  getInitialState: function(){
    return {tests:[]};
  },
  componentDidMount: function(){
    var _this = this;
    var i = 0;
    async.whilst(function(){ return true;},function(next){
      if(!_this.props.gistInfo.id) return setTimeout(next,100);

      // TODO: make object
      runTests(_this.props.gistInfo,
        _this.props.setup,_this.props.scripts,_this.props.teardown,
        function(e,tests){
        if(e) throw e;
        console.log('finished tests');
        i = (i+1)%10;
        _this.state.tests = _this.state.tests.concat(tests);
        if(i){
          _this.setState({
            tests: _this.state.tests.concat(tests)
          });
        }
        setTimeout(next,100);
      });
    },function(){
      throw new Error('this should never happen');
    });
  },
  render: function(){
    return (<div>
      <h1>{this.state.state}</h1>
    </div>);
  }
});