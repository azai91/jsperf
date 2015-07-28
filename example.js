var async = require('async');

async.each(
	[1,2,3,4,5,6,7,8,9], 
	function(number,next){ 
		console.log(number); 
		setTimeout(function(){
			next()
		},2*1000); 

	},function(e){ 
		console.log("we are done"); 
	}
);

