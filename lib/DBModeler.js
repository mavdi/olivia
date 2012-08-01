var DBModeler = function() {
}

DBModeler.prototype = (function() {
	
	var mongoose = require("mongoose");
	var Schema = mongoose.Schema;
	var bcrypt = require("bcrypt");
	
	var createSchema = function() {
		console.log("creating schema");
		var Owner = new Schema({
			username : String,
			password : String,
			email : String			
		});

		var Post = new Schema({
			title : String,
			content : String,
			date : Date,
			owner : {type : Schema.ObjectId, ref : "Owner"}
		});
		
		mongoose.model("Owner", Owner);
		mongoose.model("Post", Post);		
		
	}

	return {
		constructor : DBModeler,
		init : function() {
			console.log("DBModeler init");
			var db = mongoose.connect("mongodb://localhost/portfoliodb", function(error) {
				if(error) {
					console.log("DBModeler error connecting to DB");
					throw error;
				} 
			});
			console.log("DBModeler db " + db);
			createSchema();
		},
		createAdmin : function() {
			var salt = bcrypt.genSaltSync(10);
			var hash = bcrypt.hashSync("unreal12", salt);
			var Owner = mongoose.model("Owner");
			var owner = new Owner();
			owner.username = "mavdi";
			owner.password = hash;
			owner.email = "mehdi.avdi@gmail.com";
			
			owner.save(function(error, result){
				if(!error) {
					console.log("admin saved");
				}
			});
		}	
	}	
})();

module.exports = new DBModeler();
