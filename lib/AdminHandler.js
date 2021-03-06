var AdminHandler = function() {

}

AdminHandler.prototype = (function(){
	var mongoose = require("mongoose");
	var bcrypt = require("bcrypt");
	var marked = require("marked");
	
	var init = function(request, response) {
		marked.setOptions({
			gfm : true,
			pedantic : false,
			sanitize : true,
			highlight : function(code, lang) {
				//no highlighting at this moment
				return code;
			}	
		});
	}
	
	var loadMain = function(request, response) {
		if(request.body.username) {
			login(request, response);
			return;
		}	
		
		switch(request.query.action) {
			case "logout":
				logout(request, response);
				break;
			case "manage-posts":
				managePosts(request, response);
				break;
			case "new-post":
				response.render("adminpost", {admin : true, username : request.session.username});
		}

		if(request.query.action) return;
	
		showLogin(request, response);
	}
		
	var showLogin = function(request, response) {
		console.log("show login");
		response.render("admin", {admin : true});
		
	}

	var login = function(request, response){
		var Owner = mongoose.model("Owner");
		if(request.session && request.session.username) {
			response.render("adminpost", {admin : true, username : request.session.username});
			return;
		}

		Owner.find({username : request.body.username}, function(error, result) {
			if(error || result.length == 0 || !bcrypt.compareSync(request.body.password, result[0].password)) {
				response.render("admin", {admin : true, username : request.body.username});
				console.log("admin fail");
			} else {
				request.session.username = request.body.username;
				response.render("adminpost", {admin : true, username : request.body.username});
				console.log("admin success");
			}
			
		});
	}
		
	var logOut =  function(request, response) {
		console.log("logging our");
		if(request.session) {
			if(request.session.username) {
				request.session.username = null;
				response.clearCookie("username");
			}
			request.session.destroy();
		}
		response.redirect("/admin");
		
	}

	var managePosts = function(request, response) {
		var Post = mongoose.model("Post");

		Post.find({}, function(error, result) {
			if(result) {
				response.render("admin-manage-posts", {admin : true, posts : result});
			} else {
				response.send("No posts found!");
			}
		});
	}
	
	var post = function(request, response) {
		if(!request.session.username) {	
			response.send("you are not logged in");
		}
		var Post = mongoose.model("Post");
		var Owner = mongoose.model("Owner");
		
		Owner.findOne({username : request.session.username}, function(error, result){
			if(result) {
				var post = new Post();
				post.title = request.body.title;
				post.contentRaw = request.body.content;
				post.content = marked(request.body.content);
				post.date = new Date();
				post.owner = result._id;
				
				post.save(function(error, result) {
					if(result) {
						response.send("post made");
					} else {
						response.send("post failed " + error);
					}
				});
			} else {
				console.log("An error occured, your session might have expired. Please try to log in again");
			}
		});
		
		}
	
	
	return {
		init : init,
		loadMain : loadMain,
		post : post
		}
})();

module.exports = new AdminHandler();
