//console.log("application")
var express = require('express');
var path = require('path');

// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");

// Requiring our Note and Article models
var Article = require("../models/Article.js");

var router  = express.Router();

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname + '/../public/home.html'));
})


router.get('/scrape',function(req,res){
  // Run request to grab the HTML from awwards's clean website section
  request("http://www.npr.org", function(error, response, html) {
  // Load the HTML into cheerio
  var $ = cheerio.load(html);
  // // Make an empty array for saving our scraped info
   var result = [];
  // // With cheerio
  $("div.story-wrap").each(function(i, element) {
    var newNews = {} 
      newNews.title = $(element).find(".title").html();
      newNews.imgSrc = $(element).find('img').attr('src');
      newNews.article = $(element).find('.teaser').text();
      newNews.link = $(element).find("a").attr("href");


    // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(newNews);
      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    result.push({ newNews});
   });

  // // With each link scraped, log the result to the console
   console.log(result);

 res.redirect('/');

  });
});


module.exports = router;