var browserify = require('browserify');
var literalify = require('literalify');
var express = require('express');
var sa = require('superagent');
var app = express.Router();
var getGist = require('./shared/get-gist');
var config = require('getconfig');

process.env.GITHUB_CLIENT = JSON.stringify({
  client_id:config.github.id,
  client_secret:config.github.secret
})

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
  .transform(literalify.configure({
    'react': 'window.React',
    'c3': 'window.c3'
  }))
  .transform(require('envify'))
  .bundle()
  .pipe(res);
});

// We should heavilly consider rendering this sort of thing server side for SEO purposes
// https://github.com/mhart/react-server-routing-example
app.get('/:id',function(req,res,next){
  res.sendFile(__dirname+'/client/index.html');
});


module.exports = app;
