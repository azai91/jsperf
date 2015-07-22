var React = require('react');
var Repo = require('./repo');
var sa = require('superagent');
var url = require('url');

window.addEventListener('load',function(){
  var path = url.parse(window.location.href).path.split('/');
  var id = "";
  while(path.length && (id === "" || id === "perform-test")) id = path.pop();
  console.log(id);
  if(id !== "" || id !== "perform-test") id = "5d11c5aa33e8f9c90c8f";
  React.render(<Repo repoId={id} />,document.body);
});
