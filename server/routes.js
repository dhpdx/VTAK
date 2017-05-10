var mongoose = require('mongoose'); // do we need to require this again?
var Promise = require('bluebird');
var twitterOptions = require('./config/twitterOptions.js');
var twitterController = require('./controllers/twitterApiController.js');
var watson = require('./controllers/watson.js');
var Tweet = require('./controllers/dbController.js');
var stream = require('express-stream');
var TweetStream = require('./config/streamingTwitter')
var Twitter = require('twitter');
var request = require('request');
var io = require('./server.js');

var client = new Twitter({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: env.ACCESS_TOKEN_SECRET
});


// Promisify API calls
var promiseTwitter = Promise.promisify(twitterController.getRequestTwitter);
var promiseWatson = Promise.promisify(watson.getTone);

module.exports = function(app, express) {

	// app.get('/api/tweets', function(req, res) {
	// 	// TweetStream.getTweets(tweets => {
	// 		io.on('connection', function(socket) {
	// 			io.emit('tweet', [-97.50, 25.87]);
	// 		});
	// 	// })
	// 	res.send('yo');

	// });

	app.get('/api/tweetOnce', function(req, res) {
		TweetStream.getTweets(tweets => {
			res.send(tweets);
		})
	})

	app.post('/api/handle', function(req, res) {

		// Final object sent to front end that includes watson response object and user details
		var frontEndResponse = {};

		// console.log("I'M HERERERE...in routes.js, app.post(/api/handle). before promiseTwitter. req.body = ", req.body);
		promiseTwitter(twitterOptions, req.body.handle)
			.then(function(result) {
				frontEndResponse.handle = result.screen_name;
				frontEndResponse.imageUrl = result.profile_image_url;
				frontEndResponse.location = result.location || "none provided";
				frontEndResponse.name = result.name || "none provided";
				frontEndResponse.description = result.description || "none provided";
				frontEndResponse.followers = result.followers_count;
				frontEndResponse.friends = result.friends_count;
				frontEndResponse.watsonResults = {};
				frontEndResponse.tweets = result.tweets;
				promiseWatson(result.finalString)
					.then(function(result) {
						// console.log('in routes.js, app.post(/api/handle), promiseWatson, l 31. result about to be sent to db = ', result);
						for (var key in result) {
	      			frontEndResponse.watsonResults[key] = (result[key].score !== result[key].score) ? 0 : result[key].score;
	      		}
						// console.log('\n\nin routes.js. l 40. promiseWatson result obj = final Object*&*&*&*&*&*&*&*&', frontEndResponse, '\n\n');
						Tweet.saveToDB(frontEndResponse);
						res.send(frontEndResponse);
					})
					.catch(function(err) {
						console.error(err);
						res.status(400).send('whoops');
					});
			})
			.catch(function(err) {
				console.error(err);
				res.status(400).send(err.errors[0].code.toString());
			});
	});

	app.post('/api/id/:id', function(req, res) {
		let id = req.params.id;
		console.log('in routes.js, app.get(api/archives/:id), line 42. id queried = ', id);
		Tweet.findResultsById(req, res, id)
	});

	app.get('/api/archives', function(req, res) {
		Tweet.getArchives(req, res);

  });

  app.get('/api/killdb', function(req, res) {
  	Tweet.emptyDatabase(req, res);
  });

  app.post('/api/sample', function(req, res) {
		var sampleResponse={}
		console.log('ROUTES>JS $$$$$$$ TEXTTT', req.body.sample)
	    promiseWatson(req.body.sample)
	        .then(function(result) {
	            console.log('i********* sample RESULT --->>>>>>', result);
	            for (var key in result) {
	                sampleResponse[key] = result[key].score;
	            }
	            console.log('\n\n***** sample RESPONSE ---- >>>>', sampleResponse, '\n\n');
	            // Tweet.saveToDB(frontEndResponse);
	            res.send(sampleResponse);
	        })
	        .catch(function(err) {
	            console.error(err);
	            res.status(400).send('whoops');
	        });
	});
};
