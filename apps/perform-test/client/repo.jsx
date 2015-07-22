var React = require('react');
var Tester = require('./tester');
var Script = require('./script');
var getGist = require('../shared/get-gist');

module.exports = React.createClass({
  getInitialState:function(){
    return {setup:"",scripts:[],teardown:""};
  }, componentDidMount: function(){
    var _this = this;
    getGist(this.props.repoId,function(err,res){
      if(err) throw err;
      _this.setState(res);
    });
  }, forkTests: function(){
    window.location = this.state.raw.html_url;
  }, render: function(){
    return (<div>
      <button onClick={this.forkTests} >Fork</button>
      <Tester
        scripts={this.state.scripts}
        teardown={this.state.teardown}
        setup={this.state.setup}
        updateScript={function(){}}
      />
      <table>{this.state.scripts.map(function(script){
        return <Script script={script} />;
      })}</table>
    </div>);
  }
});

