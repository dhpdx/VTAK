var Twitter = require('twitter');
var request = require('request');
var socket = require('../server.js');


var client = new Twitter({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

var params = {screen_name: 'danrhendrix'};

var getTweets = function(callback) {
	var stream = client.stream('statuses/filter' , {locations: '-122, 26, -68, 47'})

	var tweetStream = [];
	var results = [];
	stream.on('data', event => {
				if (event.user) {
				var propertiesObject = { address: event.user.location };
				request.get({
					url: 'http://maps.googleapis.com/maps/api/geocode/json',
					'Content-Type': 'application/json',
					qs: propertiesObject
				}, function(err, resp, body) {
						var responseObj = JSON.parse(body)
						if (responseObj.results[0]) {
							tweetStream.push([event.text, [responseObj.results[0].geometry.location.lng, responseObj.results[0].geometry.location.lat ]]);
							callback(tweetStream)
						}
				});
			} else {
				console.log('no user info')
			};
	});
}


module.exports = {
	getTweets
}
