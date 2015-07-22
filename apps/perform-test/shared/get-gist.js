var sa = require('superagent');
var async = require('async');

var htmlEntities = require('html-entities');
var stripComments = require('strip-comments');
var isTest = /^test-\d+\.js$/i;
var isStartup = /^startup\.js$/i;
var isTeardown = /^teardown\.js$/i;
var getTitle = /^\/\/ *Title: *(\S.*)$/;


module.exports = function(gistId,next){
  sa.get('http://api.github.com/gists/'+gistId,function(err,res){
    if(err) return next(err);
    var setup = "";
    var scripts = [];
    var teardown = "";
    async.each(Object.keys(res.body.files),function(filename,next){
      var file = res.body.files[filename];
      file.filename = filename;
      if(isStartup.test(filename)) setup = file;
      else if(isTeardown.test(filename)) teardown = file;
      else if(isTest.test(filename)) scripts.push(file);
      else return next(new Error('bad file name: '+filename));
      sa.get(file.raw_url,function(err,res){
        if(err) return next(err);
        var splitText = res.text.split('\n');
        var title,i=0;
        while(!title && i < splitText.length) title = getTitle.exec(splitText[i++]);
        file.title = htmlEntities(title&&title.length?title[1]:filename);
        file.text = stripComments(res.text);
        next();
      });
    },function(err){
      next(err,{
        raw:res,
        setup:setup,
        scripts:scripts,
        teardown:teardown
      });
    });
  });
};