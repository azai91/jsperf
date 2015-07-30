var React = require('react');
var Repo = require('./repo');
var url = require('url');

window.addEventListener('load',function(){
  var path = url.parse(window.location.href).path.split('/');
  var sha = "";
  var id = "";

  // format of url should be /perform-test/:id/:sha
  // TODO: clean up two while loops
  // path is not empty and string is empty or perform-test inside sha
  while(path.length && (/^$|perform\-test/.test(sha))){
    sha = path.pop();
  }
  while(path.length && /^$|perform\-test/.test(id)){
    id = path.pop();
  }

  //for testing purposes
  if(/^$|perform\-test/.test(sha)){
    // default id if sha doesn't exist
    id = "5d11c5aa33e8f9c90c8f";
  }else if(/^$|perform\-test/.test(id)){
    // default id if id does not exist
    id = sha;
  }else{
    // if both exist
    id += "/"+sha;
  }
  React.render(<Repo repoId={id} />,document.body);
});
