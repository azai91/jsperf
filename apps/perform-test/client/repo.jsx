var React = require('react');
var Tester = require('./histo-tester');
var Script = require('./script');
var getGist = require('../shared/get-gist');
var Chart = require('./charts/c3-chart');
var sa = require('superagent');

module.exports = React.createClass({
  getInitialState:function(){
    return {setup:"",scripts:[],teardown:"", data:[]};
  }, componentDidMount: function(){
    var _this = this;
    getGist(this.props.repoId,function(err,res){
      if(err) throw err;
      sa.get('/benchmark-test',function(err,ari){
        console.log(err,ari);
        if(err) throw err;
        res.benchmarks = ari.body;
        _this.setState(res);
      });
    });
  }, forkTests: function(){
    window.location = this.state.raw.html_url;
  }, retHz: function(test){
    return test.test.hz;
  }, testGroups: function(test){
    return test.test.title;
  }, render: function(){
    return (<div>
      <button onClick={this.forkTests} >Fork</button>
      <Tester
        gistInfo={{id:this.state.id,version:this.state.version}}
        scripts={this.state.scripts}
        teardown={this.state.teardown}
        setup={this.state.setup}
        updateScript={function(){}}
      />
      <Chart
        xAccessor={this.retHz}
        groupAccessor={this.testGroups}
        data={this.state.benchmarks}
      />
      <table>{this.state.scripts.map(function(script){
        return <Script script={script} />;
      })}</table>
    </div>);
  }
});

