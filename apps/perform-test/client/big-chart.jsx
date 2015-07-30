var React = require('react');
require('jslitmus');
console.log(jslitmus);
var vm = require('vm-shim');
var Script = require('./script');
var async = require('async');
var querystring = require('querystring');
var Chart = require('./test-chart');


// NOT USED ATM
module.exports = React.createClass({
  getInitialState: function(){
    return {state:"stopped",tests:[]};
  },startTests: function(){
    if(this.state.state !== "stopped") return;
    console.log('starting tests');
    var _this = this;
    var tests = this.props.scripts.map(function(script){
      var context = {ref_holder:{}};
      console.log(_this.props.setup);
      vm.runInNewContext('ref_holder.value = function(){'+(_this.props.setup.content||"")+'\n'+script.content+'}',context);
      console.log(context.ref_holder.value.toString());
      var test = new jslitmus.Test(script.title, context.ref_holder.value);
      test.script = script;
      return test;
    });
    async.each(tests,function(test,next){
      var script = test.script;
      script.state = "pending";
      test.on('start',function(test){
        console.log(test.script.title,' started');
        script.state = 'running';
        _this.props.updateScript(test.script);
      });
      test.on('complete', function(test) {
        console.log(test.script.title,' finished');
        script.state = 'finished';
        _this.props.updateScript(test.script);
        next();
      });
      test.run();
    },function(e){
      console.log('finished tests');
      _this.setState({
        state:"finished"
      });
    });
    console.log('added tests');
    _this.setState({state:"running",tests:tests});
  },render: function(){
    return (<svg>{[
      <h1>{this.state.state}</h1>,
      <button onClick={this.startTests} >Start Tests</button>,
      <p>{this.state.state==='finished'?<Chart tests={this.state.tests} />:"Press start tests"}</p>
    ]}</svg>);
  }
});