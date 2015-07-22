var React = require('react');
var jslitmus = require('jslitmus');
var async = require('async');
var vm = require('vm');
var Script = require('./script');

var TestPerformer = React.createClass({
  getInitialState: function(){
    return {state:"stopped"};
  },startTests: function(){
    if(this.state !== "stopped") return;
    var _this = this;
    this.props.scripts.map(function(script,next){
      var fn = vm.runInNewContext('function(){'+script.text+'}',{});
      var test = jslitmus.test(script.title, fn);
      script.test = test;
      test.script = script;
      script.state = "pending";
    });
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
      <div>
        <button onClick={this.startTests} >Start Tests</button>
        <button onClick={this.forkTests} >Fork</button>
      </div>
      <table>{this.props.scripts.map(function(script){
        return <Script title={script.title} text={script.text} state={script.state} result={script.test.getHz(true)} />;
      })}</table>
    </div>);
  }
});