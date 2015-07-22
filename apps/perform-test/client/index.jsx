var React = require('react');
var Repo = require('./repo');
var sa = require('superagent');

window.addEventListener('load',function(){
  React.render(<Repo repoId="5d11c5aa33e8f9c90c8f" />,document.body);
});
