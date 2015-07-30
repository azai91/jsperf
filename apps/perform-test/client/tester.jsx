var React = require('react');
var Chart = require('./charts/test-chart');
var runTests = require('../shared/run-tests');

// TODO: Name class for debugging purposes
module.exports = React.createClass({
  getInitialState: function(){
    return {state:"stopped",tests:[]};
  },
  startTests: function(){
    if(this.state.state !== "stopped") return;
    console.log('starting tests');
    var _this = this;
    runTests(this.props.setup,this.props.scripts,this.props.teardown,function(e,tests){
      console.log('finished tests');
      _this.setState({
        state:"finished",
        tests:tests
      });
    });
    console.log('added tests');
    _this.setState({state:"running",tests:tests});
  },
  render: function(){
    return (<div>
      <h1>{this.state.state}</h1>,
      <button onClick={this.startTests} >Start Tests</button>,
      <p>{this.state.state==='finished'?<Chart tests={this.state.tests} />:"Press start tests"}</p>
    </div>);
  }
});