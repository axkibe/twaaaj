var fs      = require('fs');
var sys     = require('sys');
var timers  = require('timers');
var twitter = require('./twitter');
var step = require('./step');

var twit = new twitter({
    consumer_key: 'X-X',
    consumer_secret: 'X-X',
    access_token_key: 'X-X',
    access_token_secret: 'X-X',
});


var uliststr = fs.readFileSync('ulist');
var ulist = JSON.parse(uliststr);
	
var limit;
var upos = 0;
var filenn = 0;


var getLimit;
var gotLimit;
var aquireSome;
var gotUser;

getLimit = function() {
	twit.rateLimitStatus(gotLimit);
}

gotLimit = function(limit) {
	sys.puts('limit: '+sys.inspect(limit));
	limit = limit;
	if (limit.remaining_hits < 11) {
		sys.puts('timeout to regetLimit: ' + 300000);
		timers.setTimeout(getLimit, 300000);
	} else {
		sys.puts('notimeout to aquireSome:');
		aquireUser();
	}
}

aquireUser = function() {
	sys.puts('showUser: '+ulist[upos].user);
	twit.showUser(ulist[upos].user, gotUser);
}

gotUser = function(data) {
	sys.puts('got '+sys.inspect(data));
	ulist[upos].data = data;
	upos++;
	sys.puts('wait 10');
	if (upos % 10 === 0) {
		sys.puts('write: out'+filenn);
		fs.writeFileSync('out'+filenn, JSON.stringify(ulist, null, 1));
		filenn++;
		timers.setTimeout(getLimit, 20000);
	} else {
		timers.setTimeout(aquireUser, 20000);
	}
}

getLimit();

