var Twitter = require('twitter');
var request = require('request');
var socket = require('../server.js');


var client = new Twitter({
	consumer_key: env.consumer_key,
	consumer_secret: env.consumer_secret,
  access_token_key: env.access_token_key,
  access_token_secret: env.access_token_secret
});

var params = {screen_name: 'danrhendrix'};
// client.get('statuses/user_timeline', params, function(error, tweets, response) {
//   if (!error) {
//     console.log(tweets);
//   }
// });
// console.log(socket)
  // socket.on('needTweets', function(socket) {
  // 	// io.emit('tweet', [-74,41])
  // 	io.emit('tweet', 'hi')
  // })
var getTweets = function(callback) {
	var stream = client.stream('statuses/filter' , {locations: '-122, 26, -68, 47'})
	// var stream = client.stream('statuses/sample.json')
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
