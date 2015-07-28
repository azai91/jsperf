var React = require('react');
var Repo = require('./repo');
var sa = require('superagent');
var url = require('url');

window.addEventListener('load',function(){
  var path = url.parse(window.location.href).path.split('/');
  var sha = "";
  var id = "";
  while(path.length && (/^$|perform\-test/.test(sha))){
    sha = path.pop();
  }
  while(path.length && /^$|perform\-test/.test(id)){
    id = path.pop();
  }
  //for testing purposes
  //
  if(/^$|perform\-test/.test(sha)){
    id = "5d11c5aa33e8f9c90c8f";
  }else if(/^$|perform\-test/.test(id)){
    id = sha;
  }else{
    id += "/"+sha;
  }
  React.render(<Repo repoId={id} />,document.body);
});
