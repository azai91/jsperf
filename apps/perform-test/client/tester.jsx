var React = require('react');
require('jslitmus');
console.log(jslitmus);
var vm = require('vm-shim');
var Script = require('./script');

module.exports = React.createClass({
  getInitialState: function(){
    return {state:"stopped"};
  },startTests: function(){
    if(this.state.state !== "stopped") return;
    console.log('starting tests');
    var _this = this;
    this.props.scripts.forEach(function(script,next){
      context = {value:null};
      console.log(_this.props.setup);
      vm.runInNewContext('value = function(){'+(_this.props.setup.text||"")+'\n'+script.text+'}',context);
      console.log(context.value);
      var test = jslitmus.test(script.title, context.value);
      script.test = test;
      test.script = script;
      script.state = "pending";
    });
    console.log('added tests');
    jslitmus.on('start',function(test){
      test.script.state = 'running';
      _this.setState({});
    });
    jslitmus.on('complete', function(test) {
      test.script.state = 'finished';
      _this.setState({});
    });
    // Log the test results
    jslitmus.on('all_complete', function(test) {
      console.log('finished tests');
      _this.setState({state:"finished"});
    });
    // Run it!
    jslitmus.runAll();
    _this.setState({state:"running"});
  },forkTests: function(){
    window.location = this.props.repoUrl;
  },render: function(){
    return (<div>
      <h1>{this.state.state}</h1>
      <button onClick={this.startTests} >Start Tests</button>
    </div>);
  }
});