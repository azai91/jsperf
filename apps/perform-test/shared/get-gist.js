var sa = require('superagent');
var async = require('async');

var htmlEntities = require('html-entities');
var stripComments = require('strip-comments');
var isTest = /^test-\d+\.js$/i;
var isStartup = /^startup\.js$/i;
var isTeardown = /^teardown\.js$/i;
var getTitle = /^\/\/ *Title: *(\S.*)$/;


module.exports = function(gistId,next){
  console.log(process.env.GITHUB_CLIENT);
  // TODO: Have the user login before hand
  sa.get('http://api.github.com/gists/'+gistId,JSON.parse(process.env.GITHUB_CLIENT),function(err,res){
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

      new Promise(function(res,rej){
        if(!file.truncated) return res(file.content);
        sa.get(file.raw_url,function(err,response){
          if(err) return rej(err);
          res(response.text)
        });
      }).then(function(content){
        var splitText = content.split('\n');
        var title,i=0;
        while(!title && i < splitText.length) title = getTitle.exec(splitText[i++]);
        file.title = htmlEntities(title&&title.length?title[1]:filename);
        file.content = stripComments(content);
        return file;
      }).then(next.bind(void 0, void 0)).catch(next);
    },function(err){
      next(err,{
        raw:res.body,
        id:res.body.id,
        version:res.body.history[0].version,
        setup:setup,
        scripts:scripts,
        teardown:teardown
      });
    });
  });
};