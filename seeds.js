var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");
    
var data = [
    {
        name: "Cloud's Rest",
        image: "",
        description: "And I am whatever you say I am. If I wasn't, then why would I say I am?. In the paper, the news, every day I am. Radio won't even play my jam. ‘Cause I am whatever you say I am. If I wasn't, then why would I say I am?. In the paper, the news, every day I am. I don't know, it's just the way I am."
        
    }
];

function seedDB(){
    //Remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
    });
    //Add a few campgronds
}

module.exports = seedDB;