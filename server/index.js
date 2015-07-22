var path = require('path');
global.__root = path.resolve(__dirname,'..');
global.__apps = path.resolve(__root,'./apps');

var express = require('express');

var app = express();

app.use('/perform-test',require(__apps+'/perform-test/router'));

var port = process.env.PORT||8080;
app.listen(port,function(){
  console.log('app listening on http://localhost:'+port);
});