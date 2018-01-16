require('dotenv').config();

var action = process.argv[2];
var value = process.argv[3];
var keys = require('./keys.js');
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var params = {
    screen_name: 'PaulaCarpente16',
    count: 20
	}
var request = require('request');
var fs = require('fs');
var omdb = require('omdb');


switch (action) {
	case 'mytweets':
		myTweets();
		break;
	case 'spotify':
		spotifyThis(value);
		break;
	case 'omdb':
		omdbThis(value);
		break;
	case 'random':
		random();
		break;
}

function myTweets() {
	console.log('myTweets()');
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		console.log('error', error);
		if(!error && response.statusCode === 200) {
			console.log('if(!error)');
			fs.appendFile('terminal.log', ('=============== LOG ENTRY BEGIN ===============\r\n' + Date() + '\r\n \r\nTERMINAL COMMANDS:\r\n$: ' + process.argv + '\r\n \r\nDATA OUTPUT:\r\n'), function(err) {
				if (err) throw err;
			});
			console.log('');
			console.log('Last 20 Tweets:')
			for (i = 0; i < tweets.length; i++) {
				var number = i + 1;
				console.log('');
				console.log([i + 1] + '.' + tweets[i].text);
				console.log('Created on: ' + tweets[i].created_at);
				console.log('');
				fs.appendFile('terminal.log', (number + '. Tweet: ' + tweets[i].text + '\r\nCreated at: ' + tweets[i].created_at + ' \r\n'), function(err) {
					if (err) throw err;
				});
			}
			fs.appendFile('terminal.log', ('=============== LOG ENTRY END ===============\r\n \r\n'), function(err) {
				if (err) throw err;
			});
		}
	});
}

function spotifyThis() {
	// console.log('spotify value', value);
	console.log('spotify()');
	if (value == null) {
		value = 'computer love';
	}
	spotify.search({ type: 'track', query: 'dancing in the moonlight' }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }
	 	console.log('data', data);

	    // Do something with 'data' response.tracks.items[0].name
	});
	request('https://api.spotify.com/v1/search?q=' + value + '&type=track', function(error, response, body) {
			// console.log('response', response);
			console.log('error:', error != null);
        	console.log('response:', response != null);
        	console.log('body:', body != null);
			// console.log('data', data);
		if(!error && response.statusCode == 200) {

			jsonBody = JSON.parse(body);
			console.log('');
			console.log('Artist: ' + jsonBody.tracks.items[0].name);
			console.log('Song: ' + jsonBody.tracks.items[0].name);
			console.log('Preview Link: ' + jsonBody.tracks.items[0].preview_url);
			console.log('Album: ' + jsonBody.tracks.items[0].album.name);
			console.log('');
			fs.appendFile('terminal.log', ('=============== LOG ENTRY BEGIN ===============\r\n' + Date() +'\r\n \r\nTERMINAL COMMANDS:\r\n$: ' + process.argv + '\r\n \r\nDATA OUTPUT:\r\n' + 'Artist: ' + jsonBody.tracks.items[0].artists[0].name + '\r\nSong: ' + jsonBody.tracks.items[0].name + '\r\nPreview Link: ' + jsonBody.tracks.items[0].preview_url + '\r\nAlbum: ' + jsonBody.tracks.items[0].album.name + '\r\n=============== LOG ENTRY END ===============\r\n \r\n'), function(err) {
				if (err) throw err;
			});				
			
		}		
	});
}

function omdbThis() {
	console.log('omdb value', value);
	if(value == null) {
		value = 'wargames';
	}
	request('http://www.omdbapi.com/?i=tt3896198&apikey=16c01db8' + value + '&tomatoes=true&r=json', function(error, response, body) {
			console.log('error:', error != null);
   			console.log('response:', response != null);
   			console.log('body:', body != null);

		if(!error && response.statusCode == 200) {
			jsonBody = JSON.parse(body);
			console.log('');
			console.log('Title: ' + jsonBody.Title);
			console.log('Year: ' + jsonBody.Year);
			console.log('IMDb Rating: ' + jsonBody.imdbRating);
			console.log('Country: ' + jsonBody.Country);
			console.log('Language: ' + jsonBody.Language);
			console.log('Plot: ' + jsonBody.Plot);
			console.log('');
			fs.appendFile('log.txt', ('=============== LOG ENTRY BEGIN ===============\r\n' + Date() + '\r\n \r\nTERMINAL COMMANDS: ' + process.argv + '\r\nDATA OUTPUT:\r\n' + 'Title: ' + jsonBody.Title + '\r\nYear: ' + jsonBody.Year + '\r\nIMDb Rating: ' + jsonBody.imdbRating + '\r\nCountry: ' + jsonBody.Country + '\r\nLanguage: ' + jsonBody.Language + '\r\nPlot: ' + jsonBody.Plot + '\r\nActors: ' + jsonBody.Actors + '\r\nRotten Tomatoes Rating: ' + jsonBody.tomatoRating + '\r\nRotten Tomatoes URL: ' + jsonBody.tomatoURL + '\r\n =============== LOG ENTRY END ===============\r\n \r\n'), function(err) {
				if (err) throw err;
			});
		}
	});
}

function random() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (error) {
            console.log(error);
        } else {
            var dataArr = data.split(',');
            if (dataArr[0] === 'spotify') {
                spotifyThis(dataArr[1]);
            }
            if (dataArr[0] === 'omdb') {
                omdbThis(dataArr[1]);
            }
        }
    });
}