var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var Twitter = require('twitter');
var request = require('request');



var envVars = require('../env.json');

var client = new Twitter({
	consumer_key: envVars.consumer_key,
	consumer_secret: envVars.consumer_secret,
  access_token_key: envVars.access_token_key,
  access_token_secret: envVars.access_token_secret
});

//fakingitfordemo
// var longs = [];
// for(var i = -122; i < -69; i++){
// 	longs.push(i);
// }
// var lats = [];
// for(var i = 26; i < 48; i++) {
// 	lats.push(i);
// }

// Initialize express
// var app = express();
// console.log('io from server: ', io)
var killIt = false;
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('needTweets', function(socket) {
  	killIt = false;
  	
  	//mapquest
  	var stream = client.stream('statuses/filter' , {locations: '-122, 26, -68, 47'})  	
  		stream.on('data', event => {
  			if (killIt) {
  				stream.destroy();
  				console.log('killed it')
  			}
  			else {
	  			console.log('data')
					if (event.user) {
					var propertiesObject = { key: envVars.mapquest, location: event.user.location };
					request.get({
						url: 'http://www.mapquestapi.com/geocoding/v1/address',
						'Content-Type': 'application/json',
						qs: propertiesObject
						}, function(err, resp, body) {
							console.log('err!!!! ', err)
							if (body) {
							var responseObj = JSON.parse(body)
								if (responseObj) {
									if (responseObj.results[0]) {
										if (responseObj.results[0].locations[0]) {
											var newTweet = [event.text, [responseObj.results[0].locations[0].latLng.lng, responseObj.results[0].locations[0].latLng.lat ]];
											console.log('sending tweet')
											io.emit('tweet', newTweet);
										}
									}
								}
							}
						})
					} else {
					console.log('no user info')	
					}
				}	
			})
		  stream.on('stop', function() {
	  	console.log('destroying')
	  	killIt = true;
  		})		
		});
})
  	//google
  	// var stream = client.stream('statuses/filter' , {locations: '-122, 26, -68, 47'})
  	// 	stream.on('data', event => {
  	// 		console.log('data')
			// 	if (event.user) {
			// 	var propertiesObject = { address: event.user.location };
			// 	request.get({
			// 		url: 'http://maps.googleapis.com/maps/api/geocode/json',
			// 		'Content-Type': 'application/json',
			// 		qs: propertiesObject
			// 	}, function(err, resp, body) {
			// 		console.log('err!!!! ', err)
			// 			var responseObj = JSON.parse(body)
			// 			console.log('OOOOBBBBBJJJJJJ ', responseObj)
			// 			if (responseObj.results[0]) {
			// 				var newTweet = [event.text, [responseObj.results[0].geometry.location.lng, responseObj.results[0].geometry.location.lat ]];
			// 				console.log('sending tweet')
			// 				io.emit('tweet', newTweet)
		// 	} else {
		// 		console.log('no user info')		
		// 	}
		// });
  // })

//dummy data 
		// setInterval(function() {
		// 	var randomLong = longs[Math.floor(Math.random() * longs.length)];
		// 	var randomLat = lats[Math.floor(Math.random() * lats.length)];
		// 	io.emit('tweet', [randomLong, randomLat])
		// }, 5000)
// 	})  
// });



// make connection to mongoose database
var url = envVars.mlab_url;
mongoose.connect(`${url}`).then(
  () => { console.log('mongoose connected!')},
  err => { console.log('mongoose connection error!', err) }
);

// use middleware
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true})); // in case we need this later (from Shortly-Angular sprint)
app.use(morgan('dev'));

// server static files in public
app.use(express.static(path.join(__dirname, '../public')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var port = process.env.PORT || envVars.PORT || 8222;

http.listen(port, function() {
  console.log(`\n\nlistening on port: ${port}`);
});

// Hook up routes
require('./routes.js')(app, express);

module.exports = io 

