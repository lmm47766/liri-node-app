
var keys = require("./keys.js");

var Twitter = require('twitter');
var tKeys = new Twitter(keys.twitterKeys);

var Spotify = require('node-spotify-api');
var sKeys = new Spotify(keys.spotifyKeys);

var request = require("request");

var fs = require("fs");

var inquirer = require("inquirer");


inquirer
  .prompt([
    {
      type: "input",
      message: "What is your name:",
      name: "name"
    }  
    ]).then(function(res) {

    	console.log("Welcome "+res.name);

    	prompt();


    });

function prompt(){

	  inquirer
	  .prompt([
	    {
	      type: "list",
	      message: "What would you like to do?",
	      choices: ["my-tweets", "spotify-this-song", "movie-this","do-what-it-says","quit"],
	      name: "result"
	    } 

	    ]).then(function(choice) {

	    	var action = choice.result;

			switch(action){
				case "my-tweets":
					tweet();
					break;

				case"spotify-this-song":
					spotify();
					break;

				case "movie-this":
					movie();
					break;

				case "do-what-it-says":
					doWhat();
					break;
				case "quit":
					quit();	
					break;

			}

	    });

}


function tweet(){

	tKeys.get('favorites/list', function(tweets, response) {
		

		for (var i = 0; i < 20; i++) {
			
			var tweet = "Tweet" +(i+1)+": " + response[i].text

			console.log (tweet)
			fs.appendFile("log.txt", tweet + "\n", function(data) {

			});
			prompt();

		}

	});	

}

function spotify(test){


	if (test === undefined) {


		inquirer
		  .prompt([
		    {
		      type: "input",
		      message: "What song do you want to spotify:",
		      name: "song"
		    }  
		    ]).then(function(data) {


		    	console.log(data.song);

		    	if (data.song === "") {
					data.song="The Sign Ace of Base";
				}


				sKeys.search({ type: 'track', query: data.song }, function(err, data) {

					if (err) {
						return console.log('Error occurred: ' + err);
					}
					for(var i=0; i < 4; i++){

						var songInfo = "Song: " + data.tracks.items[i].name + "\n"+
								"Artists: " + data.tracks.items[i].album.artists[0].name+"\n"+
								"Album: " + data.tracks.items[i].album.name + "\n"+
								"Link: " + data.tracks.items[i].external_urls.spotify + "\n"+ " ";

						console.log(songInfo);

						fs.appendFile("log.txt", songInfo + "\n", function(data) {

						});
					}

					prompt();
				});

		    });


	}
	else{

		sKeys.search({ type: 'track', query: test }, function(err, data) {

			if (err) {
				return console.log('Error occurred: ' + err);
			}
			for(var i=0; i < 10; i++){
				var songInfo = "Song: " + data.tracks.items[i].name + "\n"+
						"Artists: " + data.tracks.items[i].album.artists[0].name+"\n"+
						"Album: " + data.tracks.items[i].album.name + "\n"+
						"Link: " + data.tracks.items[i].external_urls.spotify + "\n"+ " ";

				console.log(songInfo);

				fs.appendFile("log.txt", songInfo + "\n", function(data) {

				});
				prompt();
			}

		});
	}

}

function movie(){

	inquirer
  .prompt([
    {
      type: "input",
      message: "Choose a movie:",
      name: "movie"
    }  
    ]).then(function(data) {

    	console.log(data.movie)
		if (data.movie === "") {
			var movieName="Mr. Nobody";
		}
		else{
			var movieName = data.movie;
		}


		request("http://www.omdbapi.com/?t="+movieName+"&y=&plot=short&apikey=trilogy", function(error, response, body) {

			if (!error && response.statusCode === 200) {


				var movieInfo = "The movie's rating is: " + JSON.parse(body).Title + "\n"+
								"The movie's release year is: " + JSON.parse(body).Year + "\n"+
								"The movie's IMDB rating is: " + JSON.parse(body).imdbRating + "\n"+
								"The movie's Rotten Tomatos score is: " + JSON.parse(body).Ratings[1].Value + "\n"+
								"The movie's Country is: " + JSON.parse(body).Country + "\n"+
								"The movie's Language is: " + JSON.parse(body).Language + "\n"+
								"The movie's Plot is: " + JSON.parse(body).Plot + "\n"+
								"The movie's Actors are: " + JSON.parse(body).Actors + "\n"+" ";


				console.log(movieInfo);
				fs.appendFile("log.txt", movieInfo + "\n", function(data) {

				});
				prompt();

			}

		});

    });


}

function doWhat(){
	fs.readFile("random.txt", "utf8", function(error, data) {

			if (error) {
			return console.log(error);
			}

			console.log(data);
			var dataArr = data.split("\"");
			spotify(dataArr[1]);
			prompt();

	});
}

function quit(){
	console.log("Thanks for using liri");
}

