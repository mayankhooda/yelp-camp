var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose	= require("mongoose"),
	Campground  = require("./models/campground"),
	Comment		= require("./models/comment"),
	seedDB		= require("./seeds");

//seedDB();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "public"));

//DB CONNECTION -> SCHEMA -> MODEL
mongoose.connect("mongodb://localhost/yelp-camp");

//ROUTES
app.get("/", function(req, res){
	res.render("home");
});

app.get("/campgrounds", function(req, res){
	Campground.find(function(err, allCampgrounds){
		if (err) {
			console.log("ERROR FINDING ALL CAMPGROUNDS!!!");
		} else {
			console.log("FOUND ALL CAMPGROUNDS!!!");
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	
	var newCampground = {name: name, image: image, description: description};
	Campground.create(newCampground, function(err, campground){
		if (err) {
			console.log(err);
			console.log("ERROR INSERTING " + campground.name + "!!!");
		} else {
			console.log("INSERTED " + campground.name + "!!!");
			res.redirect("/campgrounds")
		}
	});
});

app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new.ejs");
});

app.get("/campgrounds/:show", function(req, res){
	var id = req.params.show;
	Campground.findById(id).populate("comments").exec(function(err, campground){
		if (err) {
			console.log(err);
		} else {
			console.log(campground);
			res.render("campgrounds/show.ejs", {campground: campground});
		}
	});
});

app.get("/campgrounds/:id/comments/new", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

app.post("/campgrounds/:id/comments", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if (err) {
					console.log(err);
				} else {
					console.log(comment);
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

app.listen(3000, function(){
	console.log("SERVER IS LISTENING!");
});