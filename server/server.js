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
require('dotenv').config();
console.log('++++++++++++++++++++++ ', process.env.PORT)

require('dotenv').config()

var client = new Twitter({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

var killIt = false;

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('needTweets', function(socket) {
  	killIt = false;

  	var stream = client.stream('statuses/filter' , {locations: '-122, 26, -68, 47'})
  		stream.on('data', event => {
  			if (killIt) {
  				stream.destroy();
  				console.log('killed it')
  			}
  			else {
					if (event.user) {
					var propertiesObject = { key: process.env.MAPQUEST, location: event.user.location };
					request.get({
						url: 'http://www.mapquestapi.com/geocoding/v1/address',
						'Content-Type': 'application/json',
						qs: propertiesObject
						}, function(err, resp, body) {
							if(err) {console.log('err!!!! ', err)};
							if (body) {
							var responseObj = JSON.parse(body)
								if (responseObj) {
									if (responseObj.results[0]) {
										if (responseObj.results[0].locations[0]) {
											var newTweet = [event.text, [responseObj.results[0].locations[0].latLng.lng, responseObj.results[0].locations[0].latLng.lat ]];
											// console.log('sending tweet')
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
  socket.on('stop', function() {
	console.log('killing it');
	killIt = true;	
  });	
});
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
var url = process.env.MLAB_URL;
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


var port = process.env.PORT || 80;

http.listen(port, function() {
  console.log(`\n\nlistening on port: ${port}`);
});

// Hook up routes
require('./routes.js')(app, express);

module.exports = io
