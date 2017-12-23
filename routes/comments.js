var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.get("/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});

router.post("/", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            Campground.findById(req.params.id, function(err, campground) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("comments/edit", {
                        comment: comment,
                        campground: campground
                    });
                }
            });
        }
    });
});

router.put("/:comment_id", function(req, res) {
    var comment = req.body.comment;
    Comment.findByIdAndUpdate(req.params.comment_id, comment, function(
        err,
        updatedComment
    ) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(
        err,
        removedComment
    ) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
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
