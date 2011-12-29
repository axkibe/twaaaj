// twaaaj streamer
// Authors: Axel Kittenberger (axkibe@gmail.com)

"use strict";

var util        = require('util');
var http        = require('http');
var url         = require('url');
var fs          = require('fs');
var mongo       = require('mongodb');
var twitter     = require('./twitter');
var timers      = require('timers');
var keygrip     = require('keygrip');
var keys        = require('./keys');

var dbhost = '127.0.0.1';
var dbport = mongo.Connection.DEFAULT_PORT;

var dbserver    = new mongo.Server(dbhost, dbport, {});
var dbconnector = new mongo.Db('twaaaj', dbserver, {});
var dbclient    = null;

var twit = new twitter({
	consumer_key        : keys.consumer_key,
	consumer_secret     : keys.consumer_secret,
	access_token_key    : keys.access_token_key,
	access_token_secret : keys.access_token_secret,
	keygrip             : new keygrip(keys.keygrip),
});

var logst = fs.createWriteStream('./twaaaj.log', {'flags': 'a'});

// logs a console message
function log(text) {
	text = (new Date()) + ": " + text;
	console.log(text);
	logst.write(text);
	logst.write('\n');
}

var usersstr = fs.readFileSync('users.json');
var users = JSON.parse(usersstr);

var follow = [];
var track  = [];
for(var u = 0; u < users.length; u++) {
	follow[follow.length] = users[u].id;
	track[track.length] = '@'+users[u].name;
}

function connectDB(callback) {
	log('Connecting to database');
	dbconnector.open(function(error, p_client) {
		if(error) {
			log('cannot connect to database');
			util.puts(util.inspect(error));
			return;
		}
		// sets the global client variable for easy reuse
		dbclient = p_client;
		if (callback) callback();
	});
};

var reconnectDelay = 500;
function tweetStream(callback) {
	log('--STREAM START--');
	var followstr = follow.join(',');
	var trackstr = track.join(',');

	function dberror(error) {
		log('Database error!');
		util.puts(util.inspect(error));
		process.exit(1);
	}

	twit.stream('statuses/filter', {'follow' : followstr, 'track' : trackstr}, function(stream) {
		stream.on('data', function (data) {
			reconnectDelay = 500;
			if (!data.user || !data.text || !data.id) {
				log('INVALID DATA:'+util.inspect(data));
				return;
			}
			data._id = data.id_str;
			data.timestamp = new Date(Date.parse(data.created_at)).getTime();
			log(data.user.screen_name+':'+data.text);
			dbclient.collection('twdata', function(error, twdata) {
				if (error) { dberror(error); return; }
				twdata.insert(data, function(error, count) {
					if (error) { dberror(error); return; }
				});
			});
		});

		stream.on('error', function(error) {
			log('--STREAM ERROR--');
			log('Status: '+error.statusCode);
			//log(util.inspect(error));
		});

		stream.on('end', function(error) {
			log('--STREAM END--');
			log('Status: '+error.statusCode);
			//log(util.inspect(error));
			reconnectDelay *= 2;
			if (reconnectDelay > 5 * 60 * 1000) reconnectDelay = 5 * 60 * 1000;
			log('trying to reconnect in '+(reconnectDelay / 1000)+' seconds');
			timers.setTimeout(tweetStream, reconnectDelay);
		});

		if (callback) callback();
	});
}

// startup sequence
var callstack = [connectDB, tweetStream];

function workStack() {
	if (callstack.length == 0) {
		log("Finished startup");
		return;
	}
	var f = callstack.shift();
	f(workStack);
}

workStack();



