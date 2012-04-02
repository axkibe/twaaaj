#!/usr/local/bin/node

/**
| This script was used to process our encoded data.
| Kept here for documentation, I suppose hardly useful for other peoples project.
*/
"use strict";

var tasks = {
	plus  : true,
	user  : true,
	mlist : true,
	gexf  : true,
};

var encoding = 'ASCII';
var util = require('util');
var fs   = require('fs');

var users = {};
var weekkeys = { a: [], 1: [], 2: [], 3: [], 4: [] };

var ustatA = [
	'username',
	'casename',
	'beruf',
	'gender',
	'partei',
	'followers',
	'following',
	'tweetsTA',
	'tweetsT0',
	'tweetsT1',
	'tweetsT2',
	'tweetsT3',
	'tweetsT4',
	'tweetsT5',
	'tweetsT6',
	'tweetsT7',
	'tweetsT8',
	'tweetsT80',
	'tweetsT81',
	'tweetsT82',
	'tweetsT83',
	'tweetsT84',
	'tweetsT85',
	'tweetsT86',
	'tweetsT87',
	'tweetsT88',
	'tweetsT89',
	'mentionsOutTA',
	'mentionsOutT0',
	'mentionsOutT1',
	'mentionsOutT2',
	'mentionsOutT3',
	'mentionsOutT4',
	'mentionsOutT5',
	'mentionsOutT6',
	'mentionsOutT7',
	'mentionsOutT8',
	'mentionsOutT80',
	'mentionsOutT81',
	'mentionsOutT82',
	'mentionsOutT83',
	'mentionsOutT84',
	'mentionsOutT85',
	'mentionsOutT86',
	'mentionsOutT87',
	'mentionsOutT88',
	'mentionsOutT89',
	'mentionsInTA',
	'mentionsInT0',
	'mentionsInT1',
	'mentionsInT2',
	'mentionsInT3',
	'mentionsInT4',
	'mentionsInT5',
	'mentionsInT6',
	'mentionsInT7',
	'mentionsInT8',
	'mentionsInT80',
	'mentionsInT81',
	'mentionsInT82',
	'mentionsInT83',
	'mentionsInT84',
	'mentionsInT85',
	'mentionsInT86',
	'mentionsInT87',
	'mentionsInT88',
	'mentionsInT89',
	'retweetsOutTA',
	'retweetsOutT0',
	'retweetsOutT1',
	'retweetsOutT2',
	'retweetsOutT3',
	'retweetsOutT4',
	'retweetsOutT5',
	'retweetsOutT6',
	'retweetsOutT7',
	'retweetsOutT8',
	'retweetsOutT80',
	'retweetsOutT81',
	'retweetsOutT82',
	'retweetsOutT83',
	'retweetsOutT84',
	'retweetsOutT85',
	'retweetsOutT86',
	'retweetsOutT87',
	'retweetsOutT88',
	'retweetsOutT89',
	'retweetsInTA',
	'retweetsInT0',
	'retweetsInT1',
	'retweetsInT2',
	'retweetsInT3',
	'retweetsInT4',
	'retweetsInT5',
	'retweetsInT6',
	'retweetsInT7',
	'retweetsInT8',
	'retweetsInT80',
	'retweetsInT81',
	'retweetsInT82',
	'retweetsInT83',
	'retweetsInT84',
	'retweetsInT85',
	'retweetsInT86',
	'retweetsInT87',
	'retweetsInT88',
	'retweetsInT89',
	'mentionsUsersOutTA',
	'mentionsUsersOutT0',
	'mentionsUsersOutT1',
	'mentionsUsersOutT2',
	'mentionsUsersOutT3',
	'mentionsUsersOutT4',
	'mentionsUsersOutT5',
	'mentionsUsersOutT6',
	'mentionsUsersOutT7',
	'mentionsUsersOutT8',
	'mentionsUsersOutT80',
	'mentionsUsersOutT81',
	'mentionsUsersOutT82',
	'mentionsUsersOutT83',
	'mentionsUsersOutT84',
	'mentionsUsersOutT85',
	'mentionsUsersOutT86',
	'mentionsUsersOutT87',
	'mentionsUsersOutT88',
	'mentionsUsersOutT89',
	'mentionsUsersInTA',
	'mentionsUsersInT0',
	'mentionsUsersInT1',
	'mentionsUsersInT2',
	'mentionsUsersInT3',
	'mentionsUsersInT4',
	'mentionsUsersInT5',
	'mentionsUsersInT6',
	'mentionsUsersInT7',
	'mentionsUsersInT8',
	'mentionsUsersInT80',
	'mentionsUsersInT81',
	'mentionsUsersInT82',
	'mentionsUsersInT83',
	'mentionsUsersInT84',
	'mentionsUsersInT85',
	'mentionsUsersInT86',
	'mentionsUsersInT87',
	'mentionsUsersInT88',
	'mentionsUsersInT89',
	'mentionsN13UsersOutTA',
	'mentionsN13UsersOutT0',
	'mentionsN13UsersOutT1',
	'mentionsN13UsersOutT2',
	'mentionsN13UsersOutT3',
	'mentionsN13UsersOutT4',
	'mentionsN13UsersOutT5',
	'mentionsN13UsersOutT6',
	'mentionsN13UsersOutT7',
	'mentionsN13UsersOutT8',
	'mentionsN13UsersOutT80',
	'mentionsN13UsersOutT81',
	'mentionsN13UsersOutT82',
	'mentionsN13UsersOutT83',
	'mentionsN13UsersOutT84',
	'mentionsN13UsersOutT85',
	'mentionsN13UsersOutT86',
	'mentionsN13UsersOutT87',
	'mentionsN13UsersOutT88',
	'mentionsN13UsersOutT89',
	'mentionsN13UsersInTA',
	'mentionsN13UsersInT0',
	'mentionsN13UsersInT1',
	'mentionsN13UsersInT2',
	'mentionsN13UsersInT3',
	'mentionsN13UsersInT4',
	'mentionsN13UsersInT5',
	'mentionsN13UsersInT6',
	'mentionsN13UsersInT7',
	'mentionsN13UsersInT8',
	'mentionsN13UsersInT80',
	'mentionsN13UsersInT81',
	'mentionsN13UsersInT82',
	'mentionsN13UsersInT83',
	'mentionsN13UsersInT84',
	'mentionsN13UsersInT85',
	'mentionsN13UsersInT86',
	'mentionsN13UsersInT87',
	'mentionsN13UsersInT88',
	'mentionsN13UsersInT89',
	'mentionsN14UsersOutTA',
	'mentionsN14UsersOutT0',
	'mentionsN14UsersOutT1',
	'mentionsN14UsersOutT2',
	'mentionsN14UsersOutT3',
	'mentionsN14UsersOutT4',
	'mentionsN14UsersOutT5',
	'mentionsN14UsersOutT6',
	'mentionsN14UsersOutT7',
	'mentionsN14UsersOutT8',
	'mentionsN14UsersOutT80',
	'mentionsN14UsersOutT81',
	'mentionsN14UsersOutT82',
	'mentionsN14UsersOutT83',
	'mentionsN14UsersOutT84',
	'mentionsN14UsersOutT85',
	'mentionsN14UsersOutT86',
	'mentionsN14UsersOutT87',
	'mentionsN14UsersOutT88',
	'mentionsN14UsersOutT89',
	'mentionsN14UsersInTA',
	'mentionsN14UsersInT0',
	'mentionsN14UsersInT1',
	'mentionsN14UsersInT2',
	'mentionsN14UsersInT3',
	'mentionsN14UsersInT4',
	'mentionsN14UsersInT5',
	'mentionsN14UsersInT6',
	'mentionsN14UsersInT7',
	'mentionsN14UsersInT8',
	'mentionsN14UsersInT80',
	'mentionsN14UsersInT81',
	'mentionsN14UsersInT82',
	'mentionsN14UsersInT83',
	'mentionsN14UsersInT84',
	'mentionsN14UsersInT85',
	'mentionsN14UsersInT86',
	'mentionsN14UsersInT87',
	'mentionsN14UsersInT88',
	'mentionsN14UsersInT89'
];
var ustatK = {};

var themaA = [
	 'a', '0',
	 '1', '2', '3', '4', '5', '6', '7', '8',
	'80',
	'81', '82', '83', '84', '85', '86', '87', '88', '89'
];
var themaK = {};

/**
| Fills ...K (indexOf key) hashtables
*/
(function(){
	var a, aZ;
	for(a = 0, aZ = themaA.length; a < aZ; a++) {
		themaK[themaA[a]] = a;
	}
	for (a = 0, aZ = ustatA.length; a < aZ; a++) {
		ustatK[ustatA[a]] = a;
	}
})();

/**
| Returns all users mentioned in a text.
| with types 1-4 for the mention type.
*/
function getMentions(text) {
	var mtable = {};
	var mentions = [];

	function parse(reg, type) {
		for(var ca = reg.exec(text); ca !== null; ca = reg.exec(text)) {
			var mention = ca[1].toLowerCase();
			if (mtable[mention]) continue;
			mtable[mention] = true;
			mentions.push({ username: mention, type: type });
		}
	}

	parse(/^@([A-Za-z0-9_]+)/g,       2);  // direct address
	parse(/^\s*RT @([A-Za-z0-9_]+)/g, 3);  // simple retweet
	parse(/RT @([A-Za-z0-9_]+)/g,     4);  // commented retweet
	parse(/MT @([A-Za-z0-9_]+)/g,     4);  // modified retweet
	parse(/"@([A-Za-z0-9_]+)/g,       4);  // quote
	parse(/via\s+@([A-Za-z0-9_]+)/g,  4);  // via
	parse(/@([A-Za-z0-9_]+)/g,        1);  // normal mention

	return mentions;
}

/**
| Reads a CSV or TSV
*/
function readData(name, filename, seperator, head, defaults, max) {
	console.log('reading '+name);
	var data = [];
    var lines = fs.readFileSync(filename, encoding).split('\n');
    for (var l = 1, lZ = lines.length; l < lZ; l++) {
        var line = lines[l];
        var cols = line.split(seperator);
        if (cols.length <= 1) continue;
		var obj = {};
		for (var a = 0, aZ = head.length; a < aZ; a++) {
			if (head[a] === null) continue;
			var val;
			if (a < cols.length && (typeof(cols[a]) !== 'undefined') && cols[a] !== '') {
				val = cols[a];
			} else if (defaults[a] !== null) {
				val = defaults[a];
			} else {
				throw new Error(filename+':'+l+' '+head[a]+' missing -- '+line);
			}
			obj[head[a]] = val;
		}

        data.push(obj);
		if (l > max) break;
    }
	return data;
}

/**
| Writes a CSV or TSV
*/
function writeData(name, filename, seperator, data) {
	console.log('writing '+name);
	var lines = [];
	for (var a = 0, aZ = data.length; a < aZ; a++) {
		lines[a] = data[a].join(seperator);
	}
	fs.writeFileSync(filename, lines.join('\n'), encoding);
}


/**
| returns true if the tweet is not to be excluded.
*/
function isGoodTweet(username, mentions) {
	var user = users[username];
	if (user && user.beruf !== 0) return true;

	for (var a = 0; a < mentions.length; a++) {
		user = users[mentions[a].username];
		if (user && user.beruf !== 0) return true;
	}

	return false;
}

function initUser(username, casename, beruf, gender, partei, followers, following) {
	gender = '' + parseInt(gender);
	var user = {
		username  : username,
		casename  : casename || null,
		beruf     : beruf    || 0,
		gender    : gender   || 0,
		partei    : partei   || 0,
		followers : followers || '',
		following : following || '',
		w         : {}
	};

	for (var n in weekkeys) {
		user.w[n] = {
			tweets : {},
			mentionsOut      : {},
			mentionsIn       : {},
			mentionsOutUsers : {},
			mentionsInUsers  : {},
			retweetsIn       : {},
			retweetsOut      : {}
		};
		for (var a = 0, aZ = themaA.length; a < aZ; a++) {
			user.w[n].tweets[a]           = 0;
			user.w[n].mentionsOut[a]      = 0;
			user.w[n].mentionsIn[a]       = 0;
			user.w[n].mentionsOutUsers[a] = {};
			user.w[n].mentionsInUsers[a]  = {};
			user.w[n].retweetsIn[a]       = 0;
			user.w[n].retweetsOut[a]      = 0;
		}
	}

	return user;
}

/**
| Reads the user data
*/
function readUsers() {
	var userhead     = [
		'username', null, 'beruf','gender', null, 'partei',
	    'location', 'description', 'url', null, null,
		null, null, 'followers', null, 'following', 'listed', null ];
	var userdefaults = [null,       null,  null,   0      , null, 0];
	var userlist = readData('Users', 'UserList.txt', '\t', userhead, userdefaults);
	var a, aZ;

	for(a = 0, aZ = userlist.length; a < aZ; a++) {
		var ua = userlist[a];
		if (ua.beruf === '9') throw new Error('Beruf 9 :-(');
		userlist[a] = initUser(
			ua.username.toLowerCase(),
			ua.username,
			ua.beruf,
			ua.gender,
			ua.partei,
			ua.followers,
			ua.following
		);
	}

	// transforms list to a hashtable
	for(a = 0; a < aZ; a++) {
		users[userlist[a].username] = userlist[a];
	}
	//console.log(util.inspect(users));
}



/**
| Sets t to nearest midnight before (or equal) that.
*/
function setMidnight(t) {
	t.setHours(0);
	t.setMinutes(0);
	t.setSeconds(0);
	t.setMilliseconds(0);
	return t;
}

/**
| Processes the data into data structures.
*/
function processData(n, t0, w) {
	console.log('processing W'+n+
		' ('+t0.toLocaleDateString()+':'+t0.toLocaleTimeString()+')'
	);
	var badThema = {};

	for(var a = 0, aZ = w.length; a < aZ; a++) {
		if (a % 1000 === 0) {
			console.log('Tweet: '+a+' / '+aZ + ' Users: '+Object.keys(users).length);
		}
		var d = w[a];

		if (!themaK[d.thema]) {
			badThema[d.thema] = 1;
			d.thema = themaK['0'];
		} else {
			d.thema = themaK[d.thema];
		}

		d.casename = d.username;
		d.username = d.username.toLowerCase();
		var mentions = getMentions(d.tweet);
		d.good = isGoodTweet(d.username, mentions);
		var date = (new Date(Date.parse(d.date)));
		d.timestamp = date.getTime();
		d.day  = (n * 10 + 1) +
			(Math.floor((date.getTime() - t0.getTime()) / (24 * 60 * 60 * 1000)));
		d.hour = date.getHours();

		if (!d.good) continue;

		var user = users[d.username];
		if (!user) {
			user = users[d.username] = initUser(d.username, d.casename, 0, 0, 0);
		} else if (user.casename === null) {
			user.casename = d.casename;
		}

		user.w.a .tweets[themaK.a]++;
		user.w[n].tweets[themaK.a]++;

		user.w.a .tweets[d.thema]++;
		user.w[n].tweets[d.thema]++;

		for (var b = 0, bZ = mentions.length; b < bZ; b++) {
			if (bZ > 20) { console.log('BZ '+bz); }
			var mention = mentions[b];

			switch (mention.type) {
			case 1 : d.mention = true; break;
			case 2 : d.directAddress = true; break;
			case 3 : d.retweet = true; d.simpleRetweet = true; break;
			case 4 : d.retweet = true; d.commentRetweet = true; break;
			default : throw new Error('invalid mention type');
			}

			var muser = users[mention.username];
			if (!muser) {
				muser = users[mention.username] =
					initUser(mention.username, null, 0, 0, 0);
			}

			if (d.mention || d.directAddress) {
				muser.w.a .mentionsIn[themaK.a]++;
				muser.w[n].mentionsIn[themaK.a]++;
				muser.w.a .mentionsIn[d.thema]++;
				muser.w[n].mentionsIn[d.thema]++;

				muser.w.a. mentionsInUsers[themaK.a][d.username] = true;
				muser.w[n].mentionsInUsers[themaK.a][d.username] = true;
				muser.w.a .mentionsInUsers[d.thema][d.username] = true;
				muser.w[n].mentionsInUsers[d.thema][d.username] = true;

				user.w.a. mentionsOutUsers[themaK.a][mention.username] = true;
				user.w[n].mentionsOutUsers[themaK.a][mention.username] = true;
				user.w.a .mentionsOutUsers[d.thema][mention.username] = true;
				user.w[n].mentionsOutUsers[d.thema][mention.username] = true;
			}

			if (d.retweet) {
				muser.w.a .retweetsIn[themaK.a]++;
				muser.w[n].retweetsIn[themaK.a]++;
				muser.w.a .retweetsIn[d.thema]++;
				muser.w[n].retweetsIn[d.thema]++;
			}
		}

		if (d.mention || d.directAddress) {
			user.w.a. mentionsOut[themaK.a]++;
			user.w[n].mentionsOut[themaK.a]++;
			user.w.a .mentionsOut[d.thema]++;
			user.w[n].mentionsOut[d.thema]++;

		}

		if (d.retweet) {
			user.w.a .retweetsOut[themaK.a]++;
			user.w[n].retweetsOut[themaK.a]++;
			user.w.a .retweetsOut[d.thema]++;
			user.w[n].retweetsOut[d.thema]++;
		}
	}

	for (var k in badThema) {
		console.log('BAD THEMAS: '+util.inspect(badThema));
		break;
	}
}

/**
| Builds the plus columns output
*/
function makePlus(n, w) {
	console.log('make plus for W'+n);
	var p = [ [
		'username',
		'beruf',
		'gender',
		'partei',
		'day',
		'hour',
		'good',
		'directadress',
		'retweet',
		'simple-retweet',
		'comment-retweet',
		'mention',
		'timestamp',
		'tweet'
	] ];
	for (var a = 0, aZ = w.length; a < aZ; a++) {
		var d = w[a];
		var user = users[d.username];
		p.push([
			d.username,
			user ? (user.beruf || 0) : 0,
			user ? (user.gender || 0): 0,
			user ? (user.partei || 0) : 0,
			d.day,
			d.hour,
			d.good ? 1 : 0,
			d.directAddress ? 1 : 0,
			d.retweet ? 1 : 0,
			d.simpleRetweet ? 1 : 0,
			d.commentRetweet ? 1 : 0,
			d.mention ? 1 : 0,
			d.timestamp,
			d.tweet
		]);
	}
	return p;
}

/**
| Counts the number of users in u
*/
function countAllUsers(u) {
	return Object.keys(u).length;
}

/**
| Counts the number of users with beruf 1-4 in u
*/
function countN13Users(u) {
	var c = 0;
	for (var k in u) {
		if (users[k].beruf >= 1 && users[k].beruf <= 3) {
			c++;
		}
	}
	return c;
}


/**
| Counts the number of users with beruf 1-4 in u
*/
function countN14Users(u) {
	var c = 0;
	for (var k in u) {
		if (users[k].beruf >= 1 && users[k].beruf <= 4) {
			c++;
		}
	}
	return c;
}

/**
| Calculates user stats
*/
function makeUserStats(n) {
	var a, aZ;
	var username, user;

	console.log('make user stats ' + n);
	var p = [];
	for (username in users) {
		user = users[username];

		p.push([
			user.username,                                           // username
			user.casename,                                           // casename
			user.beruf,                                              // beruf
			user.gender,                                             // gender
			user.partei,                                             // partei
			user.followers,                                          // followers
			user.following,                                          // following
			user.w[n].tweets[themaK[ 'a']],                          // tweetsTA
			user.w[n].tweets[themaK[ '0']],                          // tweetsT0
			user.w[n].tweets[themaK[ '1']],                          // tweetsT1
			user.w[n].tweets[themaK[ '2']],                          // tweetsT2
			user.w[n].tweets[themaK[ '3']],                          // tweetsT3
			user.w[n].tweets[themaK[ '4']],                          // tweetsT4
			user.w[n].tweets[themaK[ '5']],                          // tweetsT5
			user.w[n].tweets[themaK[ '6']],                          // tweetsT6
			user.w[n].tweets[themaK[ '7']],                          // tweetsT7
			user.w[n].tweets[themaK[ '8']],                          // tweetsT8
			user.w[n].tweets[themaK['80']],                          // tweetsT80
			user.w[n].tweets[themaK['81']],                          // tweetsT81
			user.w[n].tweets[themaK['82']],                          // tweetsT82
			user.w[n].tweets[themaK['83']],                          // tweetsT83
			user.w[n].tweets[themaK['84']],                          // tweetsT84
			user.w[n].tweets[themaK['85']],                          // tweetsT85
			user.w[n].tweets[themaK['86']],                          // tweetsT86
			user.w[n].tweets[themaK['87']],                          // tweetsT87
			user.w[n].tweets[themaK['88']],                          // tweetsT88
			user.w[n].tweets[themaK['89']],                          // tweetsT89
			user.w[n].mentionsOut[themaK[ 'a']],                     // mentionsOutTA
			user.w[n].mentionsOut[themaK[ '0']],                     // mentionsOutT0
			user.w[n].mentionsOut[themaK[ '1']],                     // mentionsOutT1
			user.w[n].mentionsOut[themaK[ '2']],                     // mentionsOutT2
			user.w[n].mentionsOut[themaK[ '3']],                     // mentionsOutT3
			user.w[n].mentionsOut[themaK[ '4']],                     // mentionsOutT4
			user.w[n].mentionsOut[themaK[ '5']],                     // mentionsOutT5
			user.w[n].mentionsOut[themaK[ '6']],                     // mentionsOutT6
			user.w[n].mentionsOut[themaK[ '7']],                     // mentionsOutT7
			user.w[n].mentionsOut[themaK[ '8']],                     // mentionsOutT8
			user.w[n].mentionsOut[themaK['80']],                     // mentionsOutT80
			user.w[n].mentionsOut[themaK['81']],                     // mentionsOutT81
			user.w[n].mentionsOut[themaK['82']],                     // mentionsOutT82
			user.w[n].mentionsOut[themaK['83']],                     // mentionsOutT83
			user.w[n].mentionsOut[themaK['84']],                     // mentionsOutT84
			user.w[n].mentionsOut[themaK['85']],                     // mentionsOutT85
			user.w[n].mentionsOut[themaK['86']],                     // mentionsOutT86
			user.w[n].mentionsOut[themaK['87']],                     // mentionsOutT87
			user.w[n].mentionsOut[themaK['88']],                     // mentionsOutT88
			user.w[n].mentionsOut[themaK['89']],                     // mentionsOutT89
			user.w[n].mentionsIn [themaK[ 'a']],                     // mentionsInTA
			user.w[n].mentionsIn [themaK[ '0']],                     // mentionsInT0
			user.w[n].mentionsIn [themaK[ '1']],                     // mentionsInT1
			user.w[n].mentionsIn [themaK[ '2']],                     // mentionsInT2
			user.w[n].mentionsIn [themaK[ '3']],                     // mentionsInT3
			user.w[n].mentionsIn [themaK[ '4']],                     // mentionsInT4
			user.w[n].mentionsIn [themaK[ '5']],                     // mentionsInT5
			user.w[n].mentionsIn [themaK[ '6']],                     // mentionsInT6
			user.w[n].mentionsIn [themaK[ '7']],                     // mentionsInT7
			user.w[n].mentionsIn [themaK[ '8']],                     // mentionsInT8
			user.w[n].mentionsIn [themaK['80']],                     // mentionsInT80
			user.w[n].mentionsIn [themaK['81']],                     // mentionsInT81
			user.w[n].mentionsIn [themaK['82']],                     // mentionsInT82
			user.w[n].mentionsIn [themaK['83']],                     // mentionsInT83
			user.w[n].mentionsIn [themaK['84']],                     // mentionsInT84
			user.w[n].mentionsIn [themaK['85']],                     // mentionsInT85
			user.w[n].mentionsIn [themaK['86']],                     // mentionsInT86
			user.w[n].mentionsIn [themaK['87']],                     // mentionsInT87
			user.w[n].mentionsIn [themaK['88']],                     // mentionsInT88
			user.w[n].mentionsIn [themaK['89']],                     // mentionsInT89
			user.w[n].retweetsOut[themaK[ 'a']],                     // retweetsOutTA
			user.w[n].retweetsOut[themaK[ '0']],                     // retweetsOutT0
			user.w[n].retweetsOut[themaK[ '1']],                     // retweetsOutT1
			user.w[n].retweetsOut[themaK[ '2']],                     // retweetsOutT2
			user.w[n].retweetsOut[themaK[ '3']],                     // retweetsOutT3
			user.w[n].retweetsOut[themaK[ '4']],                     // retweetsOutT4
			user.w[n].retweetsOut[themaK[ '5']],                     // retweetsOutT5
			user.w[n].retweetsOut[themaK[ '6']],                     // retweetsOutT6
			user.w[n].retweetsOut[themaK[ '7']],                     // retweetsOutT7
			user.w[n].retweetsOut[themaK[ '8']],                     // retweetsOutT8
			user.w[n].retweetsOut[themaK['80']],                     // retweetsOutT80
			user.w[n].retweetsOut[themaK['81']],                     // retweetsOutT81
			user.w[n].retweetsOut[themaK['82']],                     // retweetsOutT82
			user.w[n].retweetsOut[themaK['83']],                     // retweetsOutT83
			user.w[n].retweetsOut[themaK['84']],                     // retweetsOutT84
			user.w[n].retweetsOut[themaK['85']],                     // retweetsOutT85
			user.w[n].retweetsOut[themaK['86']],                     // retweetsOutT86
			user.w[n].retweetsOut[themaK['87']],                     // retweetsOutT87
			user.w[n].retweetsOut[themaK['88']],                     // retweetsOutT88
			user.w[n].retweetsOut[themaK['89']],                     // retweetsOutT89
			user.w[n].retweetsIn [themaK[ 'a']],                     // retweetsInTA
			user.w[n].retweetsIn [themaK[ '0']],                     // retweetsInT0
			user.w[n].retweetsIn [themaK[ '1']],                     // retweetsInT1
			user.w[n].retweetsIn [themaK[ '2']],                     // retweetsInT2
			user.w[n].retweetsIn [themaK[ '3']],                     // retweetsInT3
			user.w[n].retweetsIn [themaK[ '4']],                     // retweetsInT4
			user.w[n].retweetsIn [themaK[ '5']],                     // retweetsInT5
			user.w[n].retweetsIn [themaK[ '6']],                     // retweetsInT6
			user.w[n].retweetsIn [themaK[ '7']],                     // retweetsInT7
			user.w[n].retweetsIn [themaK[ '8']],                     // retweetsInT8
			user.w[n].retweetsIn [themaK['80']],                     // retweetsInT80
			user.w[n].retweetsIn [themaK['81']],                     // retweetsInT81
			user.w[n].retweetsIn [themaK['82']],                     // retweetsInT82
			user.w[n].retweetsIn [themaK['83']],                     // retweetsInT83
			user.w[n].retweetsIn [themaK['84']],                     // retweetsInT84
			user.w[n].retweetsIn [themaK['85']],                     // retweetsInT85
			user.w[n].retweetsIn [themaK['86']],                     // retweetsInT86
			user.w[n].retweetsIn [themaK['87']],                     // retweetsInT87
			user.w[n].retweetsIn [themaK['88']],                     // retweetsInT88
			user.w[n].retweetsIn [themaK['89']],                     // retweetsInT89
			countAllUsers(user.w[n].mentionsOutUsers[themaK[ 'a']]), // mentionsUsersOutTA
			countAllUsers(user.w[n].mentionsOutUsers[themaK[ '0']]), // mentionsUsersOutT0
			countAllUsers(user.w[n].mentionsOutUsers[themaK[ '1']]), // mentionsUsersOutT1
			countAllUsers(user.w[n].mentionsOutUsers[themaK[ '2']]), // mentionsUsersOutT2
			countAllUsers(user.w[n].mentionsOutUsers[themaK[ '3']]), // mentionsUsersOutT3
			countAllUsers(user.w[n].mentionsOutUsers[themaK[ '4']]), // mentionsUsersOutT4
			countAllUsers(user.w[n].mentionsOutUsers[themaK[ '5']]), // mentionsUsersOutT5
			countAllUsers(user.w[n].mentionsOutUsers[themaK[ '6']]), // mentionsUsersOutT6
			countAllUsers(user.w[n].mentionsOutUsers[themaK[ '7']]), // mentionsUsersOutT7
			countAllUsers(user.w[n].mentionsOutUsers[themaK[ '8']]), // mentionsUsersOutT8
			countAllUsers(user.w[n].mentionsOutUsers[themaK['80']]), // mentionsUsersOutT80
			countAllUsers(user.w[n].mentionsOutUsers[themaK['81']]), // mentionsUsersOutT81
			countAllUsers(user.w[n].mentionsOutUsers[themaK['82']]), // mentionsUsersOutT82
			countAllUsers(user.w[n].mentionsOutUsers[themaK['83']]), // mentionsUsersOutT83
			countAllUsers(user.w[n].mentionsOutUsers[themaK['84']]), // mentionsUsersOutT84
			countAllUsers(user.w[n].mentionsOutUsers[themaK['85']]), // mentionsUsersOutT85
			countAllUsers(user.w[n].mentionsOutUsers[themaK['86']]), // mentionsUsersOutT86
			countAllUsers(user.w[n].mentionsOutUsers[themaK['87']]), // mentionsUsersOutT87
			countAllUsers(user.w[n].mentionsOutUsers[themaK['88']]), // mentionsUsersOutT88
			countAllUsers(user.w[n].mentionsOutUsers[themaK['89']]), // mentionsUsersOutT89
			countAllUsers(user.w[n].mentionsInUsers [themaK[ 'a']]), // mentionsUsersInTA
			countAllUsers(user.w[n].mentionsInUsers [themaK[ '0']]), // mentionsUsersInT0
			countAllUsers(user.w[n].mentionsInUsers [themaK[ '1']]), // mentionsUsersInT1
			countAllUsers(user.w[n].mentionsInUsers [themaK[ '2']]), // mentionsUsersInT2
			countAllUsers(user.w[n].mentionsInUsers [themaK[ '3']]), // mentionsUsersInT3
			countAllUsers(user.w[n].mentionsInUsers [themaK[ '4']]), // mentionsUsersInT4
			countAllUsers(user.w[n].mentionsInUsers [themaK[ '5']]), // mentionsUsersInT5
			countAllUsers(user.w[n].mentionsInUsers [themaK[ '6']]), // mentionsUsersInT6
			countAllUsers(user.w[n].mentionsInUsers [themaK[ '7']]), // mentionsUsersInT7
			countAllUsers(user.w[n].mentionsInUsers [themaK[ '8']]), // mentionsUsersInT8
			countAllUsers(user.w[n].mentionsInUsers [themaK['80']]), // mentionsUsersInT80
			countAllUsers(user.w[n].mentionsInUsers [themaK['81']]), // mentionsUsersInT81
			countAllUsers(user.w[n].mentionsInUsers [themaK['82']]), // mentionsUsersInT82
			countAllUsers(user.w[n].mentionsInUsers [themaK['83']]), // mentionsUsersInT83
			countAllUsers(user.w[n].mentionsInUsers [themaK['84']]), // mentionsUsersInT84
			countAllUsers(user.w[n].mentionsInUsers [themaK['85']]), // mentionsUsersInT85
			countAllUsers(user.w[n].mentionsInUsers [themaK['86']]), // mentionsUsersInT86
			countAllUsers(user.w[n].mentionsInUsers [themaK['87']]), // mentionsUsersInT87
			countAllUsers(user.w[n].mentionsInUsers [themaK['88']]), // mentionsUsersInT88
			countAllUsers(user.w[n].mentionsInUsers [themaK['89']]), // mentionsUsersInT89
			countN13Users(user.w[n].mentionsOutUsers[themaK[ 'a']]), // mentionsN13UsersOutTA
			countN13Users(user.w[n].mentionsOutUsers[themaK[ '0']]), // mentionsN13UsersOutT0
			countN13Users(user.w[n].mentionsOutUsers[themaK[ '1']]), // mentionsN13UsersOutT1
			countN13Users(user.w[n].mentionsOutUsers[themaK[ '2']]), // mentionsN13UsersOutT2
			countN13Users(user.w[n].mentionsOutUsers[themaK[ '3']]), // mentionsN13UsersOutT3
			countN13Users(user.w[n].mentionsOutUsers[themaK[ '4']]), // mentionsN13UsersOutT4
			countN13Users(user.w[n].mentionsOutUsers[themaK[ '5']]), // mentionsN13UsersOutT5
			countN13Users(user.w[n].mentionsOutUsers[themaK[ '6']]), // mentionsN13UsersOutT6
			countN13Users(user.w[n].mentionsOutUsers[themaK[ '7']]), // mentionsN13UsersOutT7
			countN13Users(user.w[n].mentionsOutUsers[themaK[ '8']]), // mentionsN13UsersOutT8
			countN13Users(user.w[n].mentionsOutUsers[themaK['80']]), // mentionsN13UsersOutT80
			countN13Users(user.w[n].mentionsOutUsers[themaK['81']]), // mentionsN13UsersOutT81
			countN13Users(user.w[n].mentionsOutUsers[themaK['82']]), // mentionsN13UsersOutT82
			countN13Users(user.w[n].mentionsOutUsers[themaK['83']]), // mentionsN13UsersOutT83
			countN13Users(user.w[n].mentionsOutUsers[themaK['84']]), // mentionsN13UsersOutT84
			countN13Users(user.w[n].mentionsOutUsers[themaK['85']]), // mentionsN13UsersOutT85
			countN13Users(user.w[n].mentionsOutUsers[themaK['86']]), // mentionsN13UsersOutT86
			countN13Users(user.w[n].mentionsOutUsers[themaK['87']]), // mentionsN13UsersOutT87
			countN13Users(user.w[n].mentionsOutUsers[themaK['88']]), // mentionsN13UsersOutT88
			countN13Users(user.w[n].mentionsOutUsers[themaK['89']]), // mentionsN13UsersOutT89
			countN13Users(user.w[n].mentionsInUsers [themaK[ 'a']]), // mentionsN13UsersInTA
			countN13Users(user.w[n].mentionsInUsers [themaK[ '0']]), // mentionsN13UsersInT0
			countN13Users(user.w[n].mentionsInUsers [themaK[ '1']]), // mentionsN13UsersInT1
			countN13Users(user.w[n].mentionsInUsers [themaK[ '2']]), // mentionsN13UsersInT2
			countN13Users(user.w[n].mentionsInUsers [themaK[ '3']]), // mentionsN13UsersInT3
			countN13Users(user.w[n].mentionsInUsers [themaK[ '4']]), // mentionsN13UsersInT4
			countN13Users(user.w[n].mentionsInUsers [themaK[ '5']]), // mentionsN13UsersInT5
			countN13Users(user.w[n].mentionsInUsers [themaK[ '6']]), // mentionsN13UsersInT6
			countN13Users(user.w[n].mentionsInUsers [themaK[ '7']]), // mentionsN13UsersInT7
			countN13Users(user.w[n].mentionsInUsers [themaK[ '8']]), // mentionsN13UsersInT8
			countN13Users(user.w[n].mentionsInUsers [themaK['80']]), // mentionsN13UsersInT80
			countN13Users(user.w[n].mentionsInUsers [themaK['81']]), // mentionsN13UsersInT81
			countN13Users(user.w[n].mentionsInUsers [themaK['82']]), // mentionsN13UsersInT82
			countN13Users(user.w[n].mentionsInUsers [themaK['83']]), // mentionsN13UsersInT83
			countN13Users(user.w[n].mentionsInUsers [themaK['84']]), // mentionsN13UsersInT84
			countN13Users(user.w[n].mentionsInUsers [themaK['85']]), // mentionsN13UsersInT85
			countN13Users(user.w[n].mentionsInUsers [themaK['86']]), // mentionsN13UsersInT86
			countN13Users(user.w[n].mentionsInUsers [themaK['87']]), // mentionsN13UsersInT87
			countN13Users(user.w[n].mentionsInUsers [themaK['88']]), // mentionsN13UsersInT88
			countN13Users(user.w[n].mentionsInUsers [themaK['89']]), // mentionsN13UsersInT89
			countN14Users(user.w[n].mentionsOutUsers[themaK[ 'a']]), // mentionsN14UsersOutTA
			countN14Users(user.w[n].mentionsOutUsers[themaK[ '0']]), // mentionsN14UsersOutT0
			countN14Users(user.w[n].mentionsOutUsers[themaK[ '1']]), // mentionsN14UsersOutT1
			countN14Users(user.w[n].mentionsOutUsers[themaK[ '2']]), // mentionsN14UsersOutT2
			countN14Users(user.w[n].mentionsOutUsers[themaK[ '3']]), // mentionsN14UsersOutT3
			countN14Users(user.w[n].mentionsOutUsers[themaK[ '4']]), // mentionsN14UsersOutT4
			countN14Users(user.w[n].mentionsOutUsers[themaK[ '5']]), // mentionsN14UsersOutT5
			countN14Users(user.w[n].mentionsOutUsers[themaK[ '6']]), // mentionsN14UsersOutT6
			countN14Users(user.w[n].mentionsOutUsers[themaK[ '7']]), // mentionsN14UsersOutT7
			countN14Users(user.w[n].mentionsOutUsers[themaK[ '8']]), // mentionsN14UsersOutT8
			countN14Users(user.w[n].mentionsOutUsers[themaK['80']]), // mentionsN14UsersOutT80
			countN14Users(user.w[n].mentionsOutUsers[themaK['81']]), // mentionsN14UsersOutT81
			countN14Users(user.w[n].mentionsOutUsers[themaK['82']]), // mentionsN14UsersOutT82
			countN14Users(user.w[n].mentionsOutUsers[themaK['83']]), // mentionsN14UsersOutT83
			countN14Users(user.w[n].mentionsOutUsers[themaK['84']]), // mentionsN14UsersOutT84
			countN14Users(user.w[n].mentionsOutUsers[themaK['85']]), // mentionsN14UsersOutT85
			countN14Users(user.w[n].mentionsOutUsers[themaK['86']]), // mentionsN14UsersOutT86
			countN14Users(user.w[n].mentionsOutUsers[themaK['87']]), // mentionsN14UsersOutT87
			countN14Users(user.w[n].mentionsOutUsers[themaK['88']]), // mentionsN14UsersOutT88
			countN14Users(user.w[n].mentionsOutUsers[themaK['89']]), // mentionsN14UsersOutT89
			countN14Users(user.w[n].mentionsInUsers [themaK[ 'a']]), // mentionsN14UsersInTA
			countN14Users(user.w[n].mentionsInUsers [themaK[ '0']]), // mentionsN14UsersInT0
			countN14Users(user.w[n].mentionsInUsers [themaK[ '1']]), // mentionsN14UsersInT1
			countN14Users(user.w[n].mentionsInUsers [themaK[ '2']]), // mentionsN14UsersInT2
			countN14Users(user.w[n].mentionsInUsers [themaK[ '3']]), // mentionsN14UsersInT3
			countN14Users(user.w[n].mentionsInUsers [themaK[ '4']]), // mentionsN14UsersInT4
			countN14Users(user.w[n].mentionsInUsers [themaK[ '5']]), // mentionsN14UsersInT5
			countN14Users(user.w[n].mentionsInUsers [themaK[ '6']]), // mentionsN14UsersInT6
			countN14Users(user.w[n].mentionsInUsers [themaK[ '7']]), // mentionsN14UsersInT7
			countN14Users(user.w[n].mentionsInUsers [themaK[ '8']]), // mentionsN14UsersInT8
			countN14Users(user.w[n].mentionsInUsers [themaK['80']]), // mentionsN14UsersInT80
			countN14Users(user.w[n].mentionsInUsers [themaK['81']]), // mentionsN14UsersInT81
			countN14Users(user.w[n].mentionsInUsers [themaK['82']]), // mentionsN14UsersInT82
			countN14Users(user.w[n].mentionsInUsers [themaK['83']]), // mentionsN14UsersInT83
			countN14Users(user.w[n].mentionsInUsers [themaK['84']]), // mentionsN14UsersInT84
			countN14Users(user.w[n].mentionsInUsers [themaK['85']]), // mentionsN14UsersInT85
			countN14Users(user.w[n].mentionsInUsers [themaK['86']]), // mentionsN14UsersInT86
			countN14Users(user.w[n].mentionsInUsers [themaK['87']]), // mentionsN14UsersInT87
			countN14Users(user.w[n].mentionsInUsers [themaK['88']]), // mentionsN14UsersInT88
			countN14Users(user.w[n].mentionsInUsers [themaK['89']]), // mentionsN14UsersInT89
		]);
		if(p[p.length-1].length !== ustatA.length) throw new Error('OWWW');
	}

	var kBeruf = ustatK['beruf'];
	var kUsername = ustatK['username'];
	p.sort(function(a, b) {
		if (a[kBeruf] === b[kBeruf]) {
			if (a[kUsername] == b[kUsername]) return  0;
			if (a[kUsername] >  b[kUsername])  return  1;
			if (a[kUsername] <  b[kUsername])  return -1;
		}
		if (!a[kBeruf]) return  1;
		if (!b[kBeruf]) return -1;
		return a[kBeruf] - b[kBeruf];
	});

	p.unshift(ustatA);
	return p;
}


function makeMList(weeks) {
	var mlist = [
		'out-username',
		'out-beruf',
		'in-username',
		'in-beruf',
		'thema',
		'w',
		'mention-type',
		'tweet',
	];
	var mls = [mlist];

	for(var n = 1; n <= 4; n++) {
		var w = weeks[n];
		for(var a = 0, aZ = w.length; a < aZ; a++) {
			var name = w[a].username;
			if (!w[a].good) continue;
			var mentions = getMentions(w[a].tweet);
			for(var m = 0, mZ = mentions.length; m < mZ; m++) {
				var men = mentions[m];
				men.username;
				mls.push([
					w[a].username,
					users[w[a].username].beruf,
					men.username,
					users[men.username].beruf,
					themaA[w[a].thema],
					n,
					men.type,
					w[a].tweet
				]);
			}
		}
	}
	return mls;
}

/**
| turns a date into a format gephi likes
*/
function gexfDateString(date) {
	var ye = '' + date.getFullYear();
	var mo = '' + (date.getMonth() + 1);
	var da = '' + date.getDate();
	var ho = '' + date.getHours();
	var mi = '' + date.getMinutes();
	var se = '' + date.getSeconds();
	while (mo.length < 2) mo = '0' + mo;
	while (da.length < 2) da = '0' + da;
	while (ho.length < 2) ho = '0' + ho;
	while (mi.length < 2) mi = '0' + mi;
	while (se.length < 2) se = '0' + se;
	return [ye,'-',mo,'-',da,'T',ho,':',mi,':',se].join('');
}

/**
| writes gephi data
*/
function writeGEXF(filename, ustat, weeks, withthema) {
	console.log('writing '+filename);
	var a, aZ, b;
	var now = new Date();

	var lines = [
        '<gexf xmlns="http://www.gexf.net/1.2draft" '+
		'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '+
		'xsi:schemaLocation="http://www.gexf.net/1.2draft '+
		'http://www.gexf.net/1.2draft/gexf.xsd" '+
        'version="1.2">',
		'<meta lastmodifieddate="'+now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+'">',
		'  <creator>dataplus</creator>',
		'  <description>All users and menitons in WA</description>',
		'</meta>',
		'<graph defaultedgetype="directed" timeformat="dateTime">',
        '  <attributes class="node">',
        '     <attribute id="0" title="Beruf" type="integer"/>',
        '     <attribute id="1" title="Gender" type="integer"/>',
        '     <attribute id="2" title="Partei" type="integer"/>',
		'     <attribute id="3" title="MentionInUsers" type="integer"/>',
		'     <attribute id="4" title="MentionOutUsers" type="integer"/>',
		'     <attribute id="5" title="MentionIn/OutUsers" type="float"/>',
		'     <attribute id="6" title="RetweetsIn" type="integer"/>',
		'     <attribute id="7" title="RetweetsOut" type="integer"/>',
		'     <attribute id="8" title="tweetsTA" type="integer"/>',
		'     <attribute id="9" title="tweetsT0" type="integer"/>',
		'     <attribute id="10" title="tweetsT1" type="integer"/>',
		'     <attribute id="11" title="tweetsT2" type="integer"/>',
		'     <attribute id="12" title="tweetsT3" type="integer"/>',
		'     <attribute id="13" title="tweetsT4" type="integer"/>',
		'     <attribute id="14" title="tweetsT5" type="integer"/>',
		'     <attribute id="15" title="tweetsT6" type="integer"/>',
		'     <attribute id="16" title="tweetsT7" type="integer"/>',
		'     <attribute id="17" title="tweetsT8" type="integer"/>',
		'     <attribute id="18" title="tweetsT80" type="integer"/>',
		'     <attribute id="19" title="tweetsT81" type="integer"/>',
		'     <attribute id="20" title="tweetsT82" type="integer"/>',
		'     <attribute id="21" title="tweetsT83" type="integer"/>',
		'     <attribute id="22" title="tweetsT84" type="integer"/>',
		'     <attribute id="23" title="tweetsT85" type="integer"/>',
		'     <attribute id="24" title="tweetsT86" type="integer"/>',
		'     <attribute id="25" title="tweetsT87" type="integer"/>',
		'     <attribute id="26" title="tweetsT88" type="integer"/>',
		'     <attribute id="27" title="tweetsT89" type="integer"/>',
        '  </attributes>',
		'',
        '  <attributes class="edge">',
        '     <attribute id="0" title="Mentiontype" type="integer"/>',
        '     <attribute id="1" title="Thema" type="integer"/>',
        '  </attributes>',
		'',
        '  <nodes>',
	];

	var nid = 0;
	var uidK = {};

	for(a = 1, aZ = ustat.length; a < aZ; a++) {
		var u = ustat[a];
		var k = ustatK;
		var name = u[k['casename']] || u[k['username']];

		var mi;
		var mo;
		var ri;
		var ro;
		if (withthema) {
			mi = 0;
			mo = 0;
			ri = 0;
			ro = 0;
			for (b = k['mentionsUsersInT1']; b <= k['mentionsUsersInT89']; b++) {
				mi += u[b];
			}
			for (b = k['mentionsUsersOutT1']; b <= k['mentionsUsersOutT89']; b++) {
				mo += u[b];
			}
			for (b = k['retweetsInT1']; b <= k['retweetsInT89']; b++) {
				ri += u[b];
			}
			for (b = k['retweetsOutT1']; b <= k['retweetsOutT89']; b++) {
				ro += u[b];
			}
		} else {
			mi = u[k['mentionsUsersInTA']];
			mo = u[k['mentionsUsersOutTA']];
			ri = u[k['retweetsInTA']];
			ro = u[k['retweetsOutTA']];
		}

		if (mi > 0 || mo > 0 || ri > 0 | ro > 0) {
		nid++;
		uidK[u[k['username']]] = nid;
		lines.push(
		'    <node id="'+nid+'" label="'+name+'">',
		'      <attvalues>',
		'        <attvalue for="0" value="'+u[k['beruf']]+'"/>',
		'        <attvalue for="1" value="'+u[k['gender']]+'"/>',
		'        <attvalue for="2" value="'+u[k['partei']]+'"/>',
		'        <attvalue for="3" value="'+mi+'"/>',
		'        <attvalue for="4" value="'+mo+'"/>',
		'        <attvalue for="5" value="'+(mi/mo)+'"/>',
		'        <attvalue for="6" value="'+ri+'"/>',
		'        <attvalue for="7" value="'+ro+'"/>',
		'        <attvalue for="8" value="'+u[k['tweetsTA']]+'"/>',
		'        <attvalue for="9" value="'+u[k['tweetsT0']]+'"/>',
		'        <attvalue for="10" value="'+u[k['tweetsT1']]+'"/>',
		'        <attvalue for="11" value="'+u[k['tweetsT2']]+'"/>',
		'        <attvalue for="12" value="'+u[k['tweetsT3']]+'"/>',
		'        <attvalue for="13" value="'+u[k['tweetsT4']]+'"/>',
		'        <attvalue for="14" value="'+u[k['tweetsT5']]+'"/>',
		'        <attvalue for="15" value="'+u[k['tweetsT6']]+'"/>',
		'        <attvalue for="16" value="'+u[k['tweetsT7']]+'"/>',
		'        <attvalue for="17" value="'+u[k['tweetsT8']]+'"/>',
		'        <attvalue for="18" value="'+u[k['tweetsT80']]+'"/>',
		'        <attvalue for="19" value="'+u[k['tweetsT81']]+'"/>',
		'        <attvalue for="20" value="'+u[k['tweetsT82']]+'"/>',
		'        <attvalue for="21" value="'+u[k['tweetsT83']]+'"/>',
		'        <attvalue for="22" value="'+u[k['tweetsT84']]+'"/>',
		'        <attvalue for="23" value="'+u[k['tweetsT85']]+'"/>',
		'        <attvalue for="24" value="'+u[k['tweetsT86']]+'"/>',
		'        <attvalue for="25" value="'+u[k['tweetsT87']]+'"/>',
		'        <attvalue for="26" value="'+u[k['tweetsT88']]+'"/>',
		'        <attvalue for="27" value="'+u[k['tweetsT89']]+'"/>',
		'      </attvalues>',
		'    </node>'
		);
		}
	}
	lines.push(
		'  </nodes>',
		'  <edges>'
	);

	var eid = 0;
	var tcount = 0;
	for(var n = 1; n <= 4; n++) {
		var w = weeks[n];
		for(a = 0, aZ = w.length; a < aZ; a++) {
			tcount++;
			var name = w[a].username;
			if (withthema && w[a].thema === themaK['0']) continue;
			if (!w[a].good) continue;

			var mentions = getMentions(w[a].tweet);
			var start = gexfDateString(new Date(w[a].timestamp));
			var end   = gexfDateString(new Date(w[a].timestamp+60*1000));

			for(var m = 0, mZ = mentions.length; m < mZ; m++) {
				var men = mentions[m];
				var src = uidK[name];
				var trg = uidK[men.username];
				if (typeof(src) === 'undefined') {
					throw new Error('src missing: '+name);
				}
				if (typeof(trg) === 'undefined') {
					throw new Error('trg missing: '+men.username);
				}

				lines.push(
			'    <edge id="'+(eid++)+'" '
			+		'source="'+src+'" '
			+		'target="'+trg+'" '
			+       'start="'+start+'" '
			+       'end="'+end+'">',
			'       <attvalues><attvalue for="0" value="'+men.type+'"/></attvalues>',
			'       <attvalues><attvalue for="1" value="'+parseInt(themaA[w[a].thema])+'"/></attvalues>',
			'    </edge>'
				);
				if (eid % 10000 === 0) { console.log('mentions: '+eid+' tweets: '+tcount); }
			}
		}
	}

	lines.push(
		'</edges>',
		'</graph>',
		'</gexf>'
	);

	fs.writeFileSync(filename, lines.join('\n'), encoding);
}

/**
| completes all tasks
*/
function main() {
	readUsers();
	var datahead = ['date', null, null, 'username', null, null, null, 'thema', 'tweet'];
	var a;
	var weeks = {};
	for(var a in weekkeys) {
		weeks[a] = [];
	}
	weeks[1] = readData('W1', 'Daten-W1.txt', '\t', datahead, []);
	weeks[2] = readData('W2', 'Daten-W2.txt', '\t', datahead, []);
	weeks[3] = readData('W3', 'Daten-W3.txt', '\t', datahead, []);
	weeks[4] = readData('W4', 'Daten-W4.txt', '\t', datahead, []);

	var ustat = { a: [], 1: [], 2: [], 3: [], 4: [] };
	var t = [
		null,
		new Date(Date.parse('14 Oct 2011 00:00:00')),
		new Date(Date.parse('02 Nov 2011 00:00:00')),
		new Date(Date.parse('27 Dec 2011 00:00:00')),
		new Date(Date.parse('25 Jan 2012 00:00:00'))
	];

	for(a = 1; a <= 4; a++) {
		processData(a, t[a], weeks[a]);
		if (tasks.plus) {
			var plus = makePlus(a, weeks[a]);
			writeData('W'+a, 'w'+a+'-plus.txt', '\t', plus);
		}
	}

	ustat.a = makeUserStats('a');
	for(a = 1; a <= 4; a++) ustat[a] = makeUserStats(a);

	if (tasks.user) {
		writeData('UA', 'ua.txt', '\t', ustat.a);
		writeData('U1', 'u1.txt', '\t', ustat[1]);
		writeData('U2', 'u2.txt', '\t', ustat[2]);
		writeData('U3', 'u3.txt', '\t', ustat[3]);
		writeData('U4', 'u4.txt', '\t', ustat[4]);
	}

	if (tasks.mlist) {
		var mlist = makeMList(weeks);
		writeData('MList', 'mlist.txt', '\t', mlist);
	}

	if (tasks.gexf) {
		writeGEXF('maa.gexf',  ustat.a, weeks, false);
		writeGEXF('ma189.gexf', ustat.a, weeks, true);
	}
}

main();
