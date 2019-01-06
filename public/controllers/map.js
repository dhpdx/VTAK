

angular.module('sentimently.heat', [])

.controller('HeatController', function($scope, Heat) {
	var tweets = [[-74,41]];
	var init = new Promise(function(resolve, reject) {
		resolve(Heat.initializeMap());
	});
	var socket = io();
	init.then(function() {
		console.log('map loaded');
	})

	$scope.getTweets = function() {
		socket.emit('needTweets', 'needTweets')
		socket.on('tweet', tweet => {
			tweets.push(tweet[1]);
			setInterval(function() {
				Heat.updateMap(tweets);
			}, 1000);
		})
	}

	$scope.stopTweets = function() {
		console.log('stopping')
		socket.emit('stop', 'stop');
	}

	// init.then(function() {
	// 	console.log('map up')
	// 		socket.emit('needTweets', 'needTweets')
	// 		socket.on('tweet', tweet => {
	// 			tweets.push(tweet[1]);
	// 			setTimeout(function() {
	// 			Heat.updateMap(tweets);
	// 	},1000)		
	// 		});
	// });
})


.factory('Heat', function($http) {
	var getTweets = function(callback) {
		return $http({
			method: 'GET',
			url: '/api/tweets',
		})
		.then(tweets => {
			// console.log('heat controller got tweeets')
			// console.log(tweets.data)
			callback(tweets.data);
		});
	};

	var getTweetsOnce = function(callback) {
		return $http({
			method: 'GET',
			url: '/api/tweetOnce'
		})
		.then(tweets => {
			callback(tweets.data);
		})
	}

var initializeMap = function() {
	console.log('init')
	var width = 960;
	var height = 600;
	var svg = d3.select("#map").append('svg')
	.attr('width', 960)
	.attr('height', 600)


	var pointProjection = d3.geo.albers()
	.scale(1275)
	.translate([width / 2, height / 2]);

	var pointPath = d3.geo.path()
	  .projection(pointProjection);

	var path = d3.geoPath();

	var testPoint = [-81,41];

		d3.json('./img/us.json', function(error, us) {
	  if (error) throw error;

	  svg.append("g")
	    .attr("class", "states")
	    .selectAll("path")
	    .data(topojson.feature(us, us.objects.states).features)
	    .enter().append("path")
	    .attr("d", path)

	  svg.append("path")
	      .attr("class", "state-borders")
	      .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
  	})
  }
	  seattle = [-122.490402, 47.60];
	  brooklyn = [-74,41]
	  texas = [-97.50, 25.87] 

	var updateMap = function(tweetStream) {
		var width = 960;
		var height = 600;
	  // seattle = [-122.490402, 47.60];
	  // brooklyn = [-74,41]
	  // texas = [-97.50, 25.87]
		var pointProjection = d3.geo.albers()
		.scale(1275)
		.translate([width / 2, height / 2]);  


	

	  // var tweetsFormatted = tweetStream[0].map(tweet => tweet[1]);
	  // console.log('formatted!!!!!!!!!! ', tweetsFormatted)
    let updateSvg = d3.select('#map svg');

	  let tweetCircles = updateSvg.selectAll('circle').data(tweetStream)
	  .enter()

	  	// let tweetCircles = updateSvg.selectAll('circle').data(tweetStream.map(tweets => tweets[1]))
	  	// .enter()
	  // .data([brooklyn, seattle, texas]).enter()
	  // .data(tweets.enter()
	  .append('svg:circle')
	  .attr("cx", function (d) { return pointProjection(d)[0]; })
	  .attr("cy", function (d) { return pointProjection(d)[1]; })
	  .attr('r', '0px')
	  .attr('fill', 'red')
	  .transition()
	  .attr("r", "8px")
	  .duration(2500)
	  .transition()
	  .attr('fill', "blue")
	  .attr('r', '0px')
	  .duration(2500)  
	}

	return { getTweets, getTweetsOnce, updateMap, initializeMap }
	});

