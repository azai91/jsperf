module.exports = function(next){
  var mongoose = require("mongoose");
  var url = "mongodb://localhost:27017";

  mongoose.connect(url);
  var erlist,oplist;
  mongoose.connection.once( "error", erlist = function(err){
    mongoose.connection.removeListener("open",oplist);
    console.error("Database Error");
    next(err);
  });
  mongoose.connection.once( "open", oplist = function(){
    mongoose.connection.removeListener("error",erlist);
    console.log("Database used "+url);
    next(void 0, mongoose);
  });
};
