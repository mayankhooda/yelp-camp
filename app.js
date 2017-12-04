var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose	= require("mongoose");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

//DB CONNECTION -> SCHEMA -> MODEL
mongoose.connect("mongodb://localhost/yelp_camp");
var campSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});
var Campground = mongoose.model("Camp", campSchema);


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
			res.render("index", {campgrounds: allCampgrounds});
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
	res.render("new.ejs");
});

app.get("/campgrounds/:show", function(req, res){
	var id = req.params.show;
	Campground.findById(id, function(err, campground){
		if (err) {
			console.log(err);
		} else {
			res.render("show.ejs", {campground: campground});
		}
	});
});


app.listen(3000, function(){
	console.log("SERVER IS LISTENING!");
});