var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/", function(req, res) {
    Campground.find(function(err, allCampgrounds) {
        if (err) {
            console.log("ERROR FINDING ALL CAMPGROUNDS!!!");
        } else {
            //console.log("FOUND ALL CAMPGROUNDS!!!");
            res.render("campgrounds/index", {
                campgrounds: allCampgrounds
            });
        }
    });
});

router.post("/", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = { name: name, image: image, description: description, author: author};
    Campground.create(newCampground, function(err, campground) {
        if (err) {
            console.log(err);
            console.log("ERROR INSERTING " + campground.name + "!!!");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new.ejs");
});

router.get("/:show", function(req, res) {
    var id = req.params.show;
    Campground.findById(id)
        .populate("comments")
        .exec(function(err, campground) {
            if (err) {
                console.log(err);
            } else {
                //console.log(campground);
                res.render("campgrounds/show.ejs", { campground: campground });
            }
        });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;