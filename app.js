var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

//seedDB();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "public"));
//
// ─── PASSPORT CONFIGURATION ─────────────────────────────────────────────────────
//
app.use(
    require("express-session")({
        secret: "My words are like a dagger with a jagged edge",
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── DATABASE CONFIGURATION ─────────────────────────────────────────────────────
//
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp-camp", { useMongoClient: true });
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── ROUTES ─────────────────────────────────────────────────────────────────────
//
app.get("/", function(req, res) {
    res.render("home");
});

app.get("/campgrounds", function(req, res) {
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

app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;

    var newCampground = { name: name, image: image, description: description };
    Campground.create(newCampground, function(err, campground) {
        if (err) {
            console.log(err);
            console.log("ERROR INSERTING " + campground.name + "!!!");
        } else {
            console.log("INSERTED " + campground.name + "!!!");
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new.ejs");
});

app.get("/campgrounds/:show", function(req, res) {
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

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    //console.log(comment);
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/campgrounds");
        });
    });
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    function(req, res) {}
);

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});
// ────────────────────────────────────────────────────────────────────────────────

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(3000, function() {
    console.log("SERVER IS LISTENING!");
});
