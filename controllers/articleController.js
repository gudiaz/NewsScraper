//console.log("application")
var express = require('express');
var path = require('path');

// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");

var express = require('express');
var path = require('path');

var Note = require("../models/Note.js");
var Article = require("../models/Article.js");


var router  = express.Router();



router.get('/',function(req,res){
	 // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

router.post('/:id',function(req,res){
	//console.log(req.body);
	var newNote = new Note(req.body);

	newNote.save(function(err, doc) {
		console.log(JSON.stringify(doc));
		console.log(req.params.id)
	    if (err) {
	      res.send(err);
	    }
	    else {
	    	Article.findOneAndUpdate({ "_id": req.params.id },
	    		{ $push: { "notes": doc._id } }, { new: true }, function(error, doc) {
			        // Send any errors to the browser
			        if (error) {
			          res.send(error);
			        } else {
			          res.send(doc);
			        }
      		});
	    }

	});

});

// Route get the note looks like WITH populating
router.get("/populated/:id", function(req, res) {
  // Set up a query to find all of the entries in our Library..
  Article.find({"_id": req.params.id})
    // ..and string a call to populate the entry with the books stored in the library's books array
    // This simple query is incredibly powerful. Remember this one!
    .populate("notes")
    // Now, execute that query
    .exec(function(error, doc) {
      // Send any errors to the browser
      if (error) {
        res.send(error);
      }
      // Or, send our results to the browser, which will now include the books stored in the library
      else {
      	//console.log(doc);
        res.send(doc);
      }
    });
});

module.exports = router;