var mongoose = require('mongoose');
var sa = require('superagent');
var async = require('async');

var schema = new mongoose.Schema({
  gist: {
    id: {type:String,required:true},
    version: {type:String,required:true}
  },
  parent: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'Benchmark'},
  platform: {
    name: {type:String,required:true},
    version: {type:String,required:true},
    os: {type:String,required:true}
  },
  test: {
    error: {type:String,validator:function(){
      return !this.test.hz;
    }},
    hz: {type:Number,validator:function(){
      return !this.test.error;
    }},
    title: {type:String,required:true},
    filename: {type:String,required:true},
    url: {type:String,required:true}
  }
});

schema.pre('validate',function(next){
  if(!this.test.error && !this.test.hz) return next(new Error('need either an error or the hz'));
  next();
});

module.exports = mongoose.model('BenchmarkTest', schema);

