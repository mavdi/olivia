var 	express = require("express"),
	mongoStore = require("session-mongoose"),
	kiwi = require("kiwi"),
	app = express.createServer(),
	adminHandler = require("./lib/AdminHandler"),
	siteHandler = require("./lib/SiteHandler"),
	dbModeler = require("./lib/DBModeler");

//init db connection
dbModeler.init();
adminHandler.init();

app.configure(function() {
		app.set("view", __dirname + "/views");
		app.set("view engine", "kiwi");
		app.use("/assets", express.static(__dirname + "/assets"));
		app.use("/scripts", express.static(__dirname + "/scripts"));
		app.use(express.bodyParser());
		app.use(express.cookieParser());
		app.locals.admin = false;		
		var mongoSessionStore = new mongoStore({
			url : "mongodb://localhost/sessions",
			interval : 120000
		});

		app.use(express.session({
			cookie : {maxAge : 1200000},
			store : mongoSessionStore,
			secret : "62f0c7fd289c2f77fd77916dbe483c1a"
		}));
		
	});

app.get("/", siteHandler.loadIndex);
app.get("/admin", adminHandler.loadMain);
app.post("/admin", adminHandler.loadMain);
app.post("/admin/post", adminHandler.post);

app.get("/test/createadmin", function(request, response) {
	dbModeler.createAdmin()
	response.send("admin created");
});

app.listen(3000);
console.log("APP RUNNING");
