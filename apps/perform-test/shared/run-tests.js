require('jslitmus');
var vm = require('vm-shim');
var async = require('async');
var sa = require('superagent');
var platform = require('./get-platform');

module.exports = function(gistInfo,setup,scripts,teardown,next){
  var tests = scripts.map(function(script){
    var context = {ref_holder:{}};
//    console.log(setup);
    vm.runInNewContext(
      'ref_holder.value = function(){'+
      (setup.content||"")+'\n'+
      script.content+'\n'+
      (teardown.content||"")+'}',
    context);
//    console.log(context.ref_holder.value.toString());
    var test = new jslitmus.Test(script.title, context.ref_holder.value);
    test.script = script;
    script.test = test;
    return test;
  });
  async.eachSeries(tests,function(test,next){
    var script = test.script;
    script.state = "pending";
    test.on('start',function(test){
//      console.log(test.script.title,' started');
      script.state = 'running';
    });
    test.on('complete', function(test) {
//      console.log(test.script.title,' finished');
      script.state = 'finished';
      requestAnimationFrame(next.bind(void 0, void 0));
    });
    test.run();
  },function(e){
    if(e) return next(e);
    console.log('posting');
    var toPost = {
      platform: platform,
      tests: scripts.map(function(script){
        return {
          error: script.test.error,
          hz: script.test.getHz(),
          title: script.title,
          filename: script.filename,
        };
      }),
      gistInfo: gistInfo
    };
    console.log('toPost',toPost);
    sa.post('/benchmark',toPost,function(e,res){
      next(e,tests);
    })
  });
};