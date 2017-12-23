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

router.post("/", isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {
        name: name,
        image: image,
        description: description,
        author: author
    };
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

router.get("/:id", function(req, res) {
    var id = req.params.id;
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

router.put("/:id", checkCampgroundOwnership, function(req, res) {
    var id = req.params.id;
    var newCampground = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description
    };
    Campground.findByIdAndUpdate(id, newCampground, function(
        err,
        updatedCampground
    ) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + updatedCampground._id);
        }
    });
});

router.get("/:id/edit", checkCampgroundOwnership, function(req, res) {
    var id = req.params.id;
    Campground.findById(id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/edit.ejs", { campground: campground });
        }
    });
});

router.delete("/:id", checkCampgroundOwnership, function(req, res) {
    var id = req.params.id;
    Campground.findByIdAndRemove(id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, campground) {
            if (err) {
                console.log(err);
            } else {
                if (campground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
