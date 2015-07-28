process.env.GETCONFIG_ROOT = __dirname+'/config';

var path = require('path');
global.__root = path.resolve(__dirname,'..');
global.__apps = path.resolve(__root,'./apps');

var db = require('./database');
var express = require('express');
var mongooseAPI = require(__apps+'/node_modules/mongoose-api');
db(function(err){
  if(err) throw err;
  var app = express();

  app.use('/perform-test',require(__apps+'/perform-test/router'));

  // Benchmark
  var Benchmark = require(__apps+'/perform-test/models/Benchmark');
  app.use('/benchmark',
    function(req,res,next){console.log('hit benchmark');next()},
    mongooseAPI(Benchmark)
  );
  var Test = require(__apps+'/perform-test/models/Test');
  app.use('/benchmark-test',
    function(req,res,next){console.log('hit benchmark-test');next()},
    mongooseAPI(Test)
  );

  var port = process.env.PORT||8080;
  app.listen(port,function(){
    console.log('app listening on http://localhost:'+port);
  });
});
