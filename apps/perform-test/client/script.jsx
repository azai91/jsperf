var React = require('react');

module.exports = React.createClass({
  getInitialState: function(){
    return null;
  },
  componentDidMount: function(){

  },
  render:function(){
    return (<tr>
        <td>{this.props.script.title}</td>
        <td><pre><code>{this.props.script.content}</code></pre></td>
        <td>{this.props.script.freq}</td>
        <td>{this.props.script.state}</td>
    </tr>);
  }
});