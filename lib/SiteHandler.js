var SiteHandler = function() {}

SiteHandler.prototype =(function(){
	var mongoose = require("mongoose");
	
	var loadIndex = function(request, response) {
		var Post = mongoose.model("Post");
		Post.find({}, function(error, result) {
			if(result) {	
				console.log("posts found");
				response.render("index", {posts : result});
			
			} else {
				console.log("no posts found " + error); 
			}
		});

		}
	
	return {
		loadIndex : loadIndex		
		}
})();

module.exports = new SiteHandler();
