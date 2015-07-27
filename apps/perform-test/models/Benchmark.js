var mongoose = require('mongoose');
//var User = require(__root+"/User/models/User");
var sa = require('superagent');
var async = require('async');
var config = require('getconfig');
var querystring = require('querystring');

var schema = new mongoose.Schema({
  /*

  TODO: Authentication

  runner: {
    name:{type:String,required:true},
    user:{
      required:true,
      type:mongoose.Schema.Types.ObjectId
      ref: 'User'
    }
  },
  */
  platform: {
    name: {type:String,required:true},
    version: {type:String,required:true},
    os: {type:String,required:true}
  },
  // the gist id and version will be the primary index
  // Ideally we can support a graph where we have best, average, worst and the person that recently ran it
  gist: {
    id: {type:String,required:true},
    owner: {
      name:{type:String,required:true},
/*      user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
      */
    },
    version: {type:String,required:true},

//    isFork: {type:Boolean,required:true}
// I want to include "isFork" however it is not simply handled
  }
});

/*
// This should always be true
schema.pre('validate',function(doc,next){
  User.findOne(doc.runner,function(err,user){
    if(err) return next(err);
    if(!user) return next(new Error('User of Id '+doc.runner+' does not exist'));
    next();
  });
});
*/

schema.virtual('gistInfo').set(function (gist) {
  this.queueState.lock('gist').pending();
  var doc = this;
  console.log({
    client_id:config.github.id,
    client_secret:config.github.secret
  });
  console.log('https://api.github.com/gists/'+gist.id+'/'+gist.version);
  sa.get('https://api.github.com/gists/'+gist.id+'/'+gist.version+'?'+querystring.stringify({
    client_id:config.github.id,
    client_secret:config.github.secret
  }),function(err,res){
    // This can either be that the version doesn't exist or the gist doesn't exist
    if(err) return doc.queueState.error(err);
    gist.owner = {name:res.body.owner.login};
    doc.gist = gist;
    doc.queueState.done();
    doc.queueState.unlock('gist',res.body);
  });
 });

schema.virtual('tests').set(function (tests) {
  var Test = require('./Test');
  var doc = this;
  this.queueState.pending().waitFor('gist',function(gist){
    doc.queueState.callback(function(e,next){
      if(e) return Test.remove({parent:doc._id}).exec(next);
      next();
    });
    var files = gist.files;
    var filenames = Object.keys(files);
    var i,l=filenames.length;
    var filteredTests = [];
    // Doing it asynchronously supports tests with larger comparisons
    async.eachSeries(filenames,function(filename,next){
      if(!/^test\-/.test(filename)) return next(); // If not a test, skip it
      var found = false,ii=0,ll=tests.length;
      async.whilst(function(){
        return found === false && ii < ll;
      }, function(next){
        if(filename === tests[ii].filename){
          found = ii;
        }
        ii++;
        setImmediate(next);
      }, function(){
        if(found === false) return next(new Error('filename '+filename+' not found'))
        var curTest = tests.splice(found,1)[0];
        filteredTests.push(curTest);
        if(!curTest.hz && !curTest.error){
          return next(new Error('test with filename '+filename+' doesn\'t have a speed nor an error'))
        }
        if(curTest.hz && curTest.error){
          return next(new Error('test with filename '+filename+' has both a speed and an error'));
        }
        curTest.url = files[filename].raw_url;
        var t = {
          gist:doc.gist.toObject(),
          parent:doc._id,
          platform:doc.platform.toObject(),
          test:curTest,
        };
        (new Test(t)).save(function(e,res){
          if(e) return next(e);
          next();
        });
      })
    },function(err){
      if(err){
        return doc.queueState.error(err);
      }
      if(tests.length){
        return doc.queueState.error(new Error('Not all tests exist in the gist'));
      }
      doc.queueState.done();
    });
  });
});

module.exports = mongoose.model('Benchmark', schema);

