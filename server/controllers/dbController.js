var Q = require('q');
var TweetModel = require('../DB/models/tweetModel.js');

// Promisify mongoose methods with `q` promise library
var findAllSearches = Q.nbind(TweetModel.find, TweetModel);
var findOne = Q.nbind(TweetModel.findOne, TweetModel);
var saveASearch = Q.nbind(TweetModel.create, TweetModel);
var empty = Q.nbind(TweetModel.remove, TweetModel);
require('dotenv').config();

module.exports = {
  saveToDB: function(resultsObject) {
   console.log('IN SAVE-TO-DB, ABOUT TO SAVE ', resultsObject);
   new TweetModel(resultsObject)
     .save(function (error) {
      if (error) {
        console.log(error);
      } else console.log('Item saved in database');
      });
    // Based on Q documentation, I think safest to use .fail here: "If you are writing JavaScript for modern engines only or using CoffeeScript, you may use catch instead of fail."
  },

  findResultsById: function(req, res, id) {
    console.log('in dbController, findResultsById, line 26. about to call findOne\n\n');
    findOne({_id: id})
      .then(function(result) {
        res.send(result);
      })
      .fail(function (error) {
        res.status(400).send('whoops');
      });
  },

  getArchives: function(req, res) {
    findAllSearches( { } )
      .then(function(returnedObj) {
        res.send(returnedObj);
      })
      .fail(function (error) {
        res.status(400).send('whoops');
      });
  },

  emptyDatabase: function(req, res) {
    console.log('GETTING READY TO DELETE!');
    empty( {} )
      .then(function() {
        return findAllSearches( {} )
      })
      .then(function(results) {
        console.log('Database now equals = ', results);
        res.sendStatus(200);
      })
      .fail(function (error) {
        console.log('DB EMPTYING ERROR ', error);
        res.status(400).send('whoops');
      })
  }

};

