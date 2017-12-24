var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res) {
    res.render("home");
});

router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome " + req.user.username);
            res.redirect("/campgrounds");
        });
    });
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post(
    "/login",
    // passport.authenticate("local", {
    //     successRedirect: "/campgrounds",
    //     failureRedirect: "/login",
    //     successFlash: "YOU ARE LOGGED IN!",
    //     failureFlash: ""
    // }),
    function(req, res) {
        passport.authenticate("local", function(err, user, info) {
            if (!user) {
                req.flash("error", "Invalid Username or Password");
                return res.redirect("/login");
            }
            req.logIn(user, function(err) {
                req.flash("success", "Welcome " + user.username);
                return res.redirect("/campgrounds");
            });
        })(req, res);
    }
);

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("error", "Logged you out!");
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
