var browserify = require('browserify');
var express = require('express');
var app = express.Router();

app.use(function(req,res,next){
  console.log('hitting router',req.url);
  next();
});

app.get('/',function(req,res){
  res.sendFile(__dirname+'/client/index.html');
});

app.get('/index.js',function(req,res){
  res.status(200).set('content-type','application/javascript');
  browserify(__dirname+'/client/index.jsx',{extensions:['.jsx']})
  .transform(require('reactify'))
  .bundle().pipe(res);
});

module.exports = app;