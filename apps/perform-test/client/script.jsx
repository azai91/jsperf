var React = require('react');

module.exports = React.createClass({
  getInitialState: function(){
    return null;
  },render:function(){
    return (<tr>
        <td>{this.props.title}</td>
        <td><pre><code>{this.props.text}</code></pre></td>
        <td>{this.props.freq}</td>
        <td>{this.props.state}</td>
    </tr>);
  }
});