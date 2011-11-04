"use strict";

var util        = require('util');
var http        = require('http');
var url         = require('url');
var querystring = require('querystring');
var fs          = require('fs');
var mongo       = require('mongodb');
var twitter     = require('./twitter');
var keygrip     = require('keygrip');
var port        = 80;
var userlist    = {axkibe : true, boomblitz : true, axelmaireder : true}; 

var twittapoll = {};
//var followlist  = require('./followlist'); 

var dbhost = '127.0.0.1';
var dbport = mongo.Connection.DEFAULT_PORT;

var dbserver    = new mongo.Server(dbhost, dbport, {});
var dbconnector = new mongo.Db('twaaaj', dbserver, {});
var dbclient    = null;

var timeSpanStart = new Date('October 8, 2011 00:00:00').getTime();
var timeSpanStop  = new Date('October 28, 2011 23:59:59').getTime();

var twit = new twitter({
	consumer_key:         keys.consumer_key,
	consumer_secret:      keys.consumer_secret, 
	access_token_key:     keys.access_token_key,
	access_token_secret:  keys.access_token_secret,
	keygrip:              new keygrip([keys.keygrip]),
});

/* a list of ressources server */
var webRessources = {
	'twajstyle.css'  : 'text/css',
	'signin.png'     : 'image/png',
}

/* returns a 404 error */
function web404(req, red, res) {
	res.writeHead(404, {'Content-Type': 'text/plain'});
	res.end('404 Not Found');
}

/* returns a 500 error */
function web500(req, red, res) {
	res.writeHead(500, {'Content-Type': 'text/plain'});
	res.end('500 Internal Server Error');
}

/* returns a ressource file */
function webRessource(req, red, res, ctype, fname, _) {
	var data;
	try {
		data = fs.readFile('./ressources/'+fname, _) }
	catch (err) {
		util.log('Failed to serve web ressource ./ressources/'+fname);
		web500(req, red, res); 
		return; 
	}; 
	res.writeHead(200, {'Content-Type': ctype});
	res.end(data, 'binary');
}

/* signin via twitter */
function webSignin(req, red, res) {
	twit.login('/signin', '/')(req, res, function(err) {
		// todo fix twit API to make something useful here
		util.log('twit called next()');
	});
}

/* signout */
function webSignout(req, red, res) {
	var cookie = twit.cookie(req, res);
	twit.clearCookie(req, res);
	res.writeHead(302, {'Location': '/'});
	res.end();
}

/**
| Returns the local date string
*/
function localeDateString(date) {
	return date.toLocaleDateString()+' '+date.toLocaleTimeString();
}

function isKnownUser(username) {
	var u = twittapoll[username];
	if (typeof(u) === 'undefined') return false;
	return u.beruf > 0 && u.beruf < 9;
}

function userBeruf(username) {
	var u = twittapoll[username];
	if (typeof(u) === 'undefined') return 0;
	return u.beruf;
}

function userGender(username) {
	var u = twittapoll[username];
	if (typeof(u) === 'undefined') return 0;
	return u.gender;
}

function userPartei(username) {
	var u = twittapoll[username];
	if (typeof(u) === 'undefined') return 0;
	return u.partei;
}


function write_(stream, text, callback) {
	if (stream.hasEnded) {
		util.log('Error: Writing on Ended Stream!');
		process.exit(1);
	}
	var more = stream.write(text);
	if (more) {
		callback(); 
	} else {
		util.log('pausing');
		stream.once('drain', function() {
			util.log('resume');
			callback();
		});
	}
}

function webTimetable(req, red, res, _) {
	res.write('<div id="content">');
	var daysAU = []; // all users
	var daysKU = []; // known users
	var tsdfirst = null;
	var toffset = (new Date()).getTimezoneOffset() * 60000 * 2;
    
	var twdata = dbclient.collection('twdata', _);
	var cursor = twdata.find(_);
	var count = cursor.count(_);
	res.write('<p>Processing '+count+' tweets.</p>');
	var first = true;
	for(var oi = 0, obj = cursor.nextObject(_); obj; oi++, obj = cursor.nextObject(_)) {
		var d = new Date(Date.parse(obj.created_at));
		var ts = (d.getTime() - toffset) / 1000;
		var tsday = Math.floor(ts / (24 * 60 * 60));
		var tshour = Math.floor((ts % (24 * 60 * 60)) / (60 * 60));
		if (first) { 
			tsdfirst = tsday;
			first = false; 
		}
		var tsdiff = tsday - tsdfirst + 8;
    
		if (!daysAU[tsdiff]) daysAU[tsdiff] = [];
		if (!daysAU[tsdiff][tshour]) daysAU[tsdiff][tshour] = 0;
		daysAU[tsdiff][tshour]++;
    
		if (isKnownUser(obj.user.screen_name)) {
			if (!daysKU[tsdiff]) daysKU[tsdiff] = [];
			if (!daysKU[tsdiff][tshour]) daysKU[tsdiff][tshour] = 0;
			daysKU[tsdiff][tshour]++;
		}
		if (oi % (Math.round(count / 100)) === 0) {
			res.write('.');
		}
	}
	
	res.write('<p>All Users</p>');
	res.write('<table>');
	res.write('<tr><td>Day/Hour</td>'+
		'<td>0:00</td><td>1:00</td><td>2:00</td><td>3:00</td><td>4:00</td><td>5:00</td>'+
	    '<td>6:00</td><td>7:00</td><td>8:00</td><td>9:00</td><td>10:00</td><td>11:00</td>'+
	    '<td>12:00</td><td>13:00</td><td>14:00</td><td>15:00</td><td>16:00</td><td>17:00</td>'+
	    '<td>18:00</td><td>19:00</td><td>20:00</td><td>21:00</td><td>22:00</td><td>23:00</td></tr>');
   	console.log('.'); 
	for (var day = 0; day < daysAU.length; day++) {
		res.write('<tr><td>'+(new Date(tsdfirst * 24 * 60 * 60000 + day * 24 * 60 * 60000).toLocaleDateString())+'</td>');
		for (var hour = 0; hour < 24; hour++) {
			res.write('<td>'+((daysAU[day] && daysAU[day][hour]) || 0)+'</td>');
		}
		res.write('</tr>');
	}
	res.write('</table>');
    
	res.write('<p>Known Users</p>');
	res.write('<table>');
	res.write('<tr><td>Day/Hour</td>'+
		'<td>0:00</td><td>1:00</td><td>2:00</td><td>3:00</td><td>4:00</td><td>5:00</td>'+
	    '<td>6:00</td><td>7:00</td><td>8:00</td><td>9:00</td><td>10:00</td><td>11:00</td>'+
	    '<td>12:00</td><td>13:00</td><td>14:00</td><td>15:00</td><td>16:00</td><td>17:00</td>'+
	    '<td>18:00</td><td>19:00</td><td>20:00</td><td>21:00</td><td>22:00</td><td>23:00</td></tr>');
	for (var day = 0; day < daysKU.length; day++) {
		res.write('<tr><td>'+(new Date(tsdfirst * 24 * 60 * 60000 + day * 24 * 60 * 60000).toLocaleDateString())+'</td>');
		for (var hour = 0; hour < 24; hour++) {
			res.write('<td>'+((daysKU[day] && daysKU[day][hour]) || 0)+'</td>');
		}
		res.write('</tr>');
	}
	res.write('</table>');
	res.end('</body></html>');
}

function webIndex(req, red, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<!DOCTYPE HTML>');
	res.write('<html>');
	res.write('<head>');
	res.write('<title>Tweet Archive Axel Axel Julian.js</title>')
	res.write('<meta charset="utf-8">');
	res.write('<link href="/twajstyle.css" rel="stylesheet" type="text/css"></link>');
	res.write('</head>');
	res.write('<body>');
	res.write('<h1>Tweet Archive (axel axel julian).js</h1>');
    var cookie = twit.cookie(req, res);
    if (!cookie) {
		res.write('<div id="hello">You are not logged in.</div>');
		res.write('<div id="content"><a href="/signin"><img src="/signin.png"></img></a></div>');
		res.end('</body>');
		return;
	} 
	if (!userlist[cookie.screen_name]) {
		res.write('<div id="hello">Hello '+cookie.screen_name+'. You are not in our userlist.</div>');
		res.write('<div id="content"><a href="/signout">signout</a></div>');
		res.end('</body>');
		return;
    }
	res.write('<div id="hello">Hello '+cookie.screen_name+'. (<a href="/signout">signout</a>)</div>');
	if (!red.query) red.query = {};
	if (!red.query.show) red.query.show = '';
	switch(red.query.show) {
	case '' :
		res.write('<div id="content">');
		res.write('<ul>');
		res.write('<li><a href="/index?show=timetable">Time table.</a></li>');
		res.write('<li><a href="/alltweets.tsv">All Tweets (TSV)</a></li>');
		res.write('<li><a href="/allhashes.tsv">All Hashes (TSV)</a></li>');
		res.write('<li><a href="/allmentions.tsv">All Mentions (TSV)</a></li>');
		res.write('<li><a href="/mentions.gexf">Mentions.gexf</a></li>');
		res.write('</ul></div>');
		res.end('</body></html>');
		break;
	case 'timetable' :
		webTimetable(req, red, res, function(err) {
			if(err) util.log(util.inspect(err));
			res.write('<div id="content">internal fail: '+err.message+'</div>');
			res.end('/body></html>');
		});
		break;
	default :
		util.log('unknown qury');
		res.write('<div id="content">unknown query.</div>');
		res.end('/body></html>');
		break;
	}
}
		
function webAllTweetsTsv(req, red, res, _) {
	var cookie = twit.cookie(req, res);
	if (!cookie) {
		res.writeHead(403, {'Content-Type': 'text/plain'});
		res.end('403 Not logged in');
		return;
	} 
	if (!userlist[cookie.screen_name]) {
		res.writeHead(403, {'Content-Type': 'text/plain'});
		res.end('403 Not in userlist');
		return;
	}
	res.writeHead(200, {'Content-Type': 'text/tab-separated-values'});
	write_(res,
		'Datum\t'+
		'#Tag\t'+
		'#Stunde\t'+
	   	'Username\t'+
	   	'Beruf\t'+
		'Gender\t'+
		'Partei\t'+
	   	'Tweet\n', 
		_);
   var tsdfirst = null;
   var first = true;
   var toffset = (new Date()).getTimezoneOffset() * 60000 * 2;
   var twdata = dbclient.collection('twdata', _);
   var cursor = twdata.find(_);
   for (var obj = cursor.nextObject(_); obj; obj = cursor.nextObject(_)) {
		process.nextTick(_);
	   	var d = new Date(Date.parse(obj.created_at));
		if (d < timeSpanStart || d > timeSpanStop) continue;
	   	var ts = (d.getTime() - toffset) / 1000;
	   	var tsday = Math.floor(ts / (24 * 60 * 60));
	   	var tshour = Math.floor((ts % (24 * 60 * 60)) / (60 * 60));
	   	if (first) { 
	   		tsdfirst = tsday;
	   		first = false; 
	   	}
	   	var tsdiff = tsday - tsdfirst + 8;
		var mentions = mentionTypes(obj.text);
		var mtype = 0;
		for(var mi = 0; mi < mentions.length; mi++) {
			if (mentions[mi].type > 1) mtype = mentions[mi].type; 
		}

	   	write_(res,
	   		localeDateString(d) + '\t' +
	   		tsdiff + '\t' + 
	   		tshour + '\t' +
	   		obj.user.screen_name + '\t' +
			userBeruf(obj.user.screen_name) + '\t' +
			userGender(obj.user.screen_name) + '\t' +
			userPartei(obj.user.screen_name) + '\t' +
	   		obj.text.replace(/\t/g,'\\t').replace(/\n/g,'\\n').replace(/\r/g,'') + '\n', 
			_);
	}
	util.log('end transmission');
	res.hasEnded = true;
	res.end();
}

function webAllHashesTsv(req, red, res, _) {
	var cookie = twit.cookie(req, res);
	if (!cookie) {
		res.writeHead(403, {'Content-Type': 'text/plain'});
		res.end('403 Not logged in');
		return;
	} 
	if (!userlist[cookie.screen_name]) {
		res.writeHead(403, {'Content-Type': 'text/plain'});
		res.end('403 Not in userlist');
		return;
	}
	res.writeHead(200, {'Content-Type': 'text/tab-separated-values'});
	write_(res,
		'Hashtag\t'+
		'HashtagsImTweet\t'+
		'Username\t'+
		'Userkategorie\t'+
		'Datum\t'+
		'#Tag\t'+
		'#Stunde\t'+
		'Tweet\n', 
		_);
	var tsdfirst = null;
	var first = true;
	var toffset = (new Date()).getTimezoneOffset() * 60000 * 2;

	var twdata = dbclient.collection('twdata', _);
	var cursor = twdata.find(_);
	for (var obj = cursor.nextObject(_); obj; obj = cursor.nextObject(_)) {
		process.nextTick(_);
		var d = new Date(Date.parse(obj.created_at));
		if (d < timeSpanStart || d > timeSpanStop) continue;
		var ts = (d.getTime() - toffset) / 1000;
		var tsday = Math.floor(ts / (24 * 60 * 60));
		var tshour = Math.floor((ts % (24 * 60 * 60)) / (60 * 60));
		if (first) { 
			tsdfirst = tsday;
	   		first = false; 
   		}
	   	var tsdiff = tsday - tsdfirst + 8;
		var ca;
		var n = 0;
		var reg = /(\#[A-z0-9_]+)/g;
		for(ca = reg.exec(obj.text); ca !== null; ca = reg.exec(obj.text)) {
			n++;
		}
		var reg = /(\#[A-z0-9_]+)/g;
		for(ca = reg.exec(obj.text); ca !== null; ca = reg.exec(obj.text)) {
		   	write_(res,
				ca[1] + '\t' +
				n + '\t' +
	   			obj.user.screen_name + '\t' +
				userBeruf(obj.user.screen_name) + '\t' +
		   		localeDateString(d) + '\t' +
		   		tsdiff + '\t' + 
	   			tshour + '\t' +
   				obj.text.replace(/\t/g,'\\t').replace(/\n/g,'\\n').replace(/\r/g,'') + '\n', 
				_);
		}
	}
	util.log('end transmission');
	res.hasEnded = true;
	res.end();
}

function webAllMentionsTsv(req, red, res, _) {
	var cookie = twit.cookie(req, res);
	if (!cookie) {
		res.writeHead(403, {'Content-Type': 'text/plain'});
		res.end('403 Not logged in');
		return;
	} 
	if (!userlist[cookie.screen_name]) {
		res.writeHead(403, {'Content-Type': 'text/plain'});
		res.end('403 Not in userlist');
		return;
	}
	res.writeHead(200, {'Content-Type': 'text/tab-separated-values'});
	write_(res,
		'MentionTyp\t'+
		'Datum\t'+
		'#Tag\t'+
		'#Stunde\t'+
	   	'VonUsername\t'+
	   	'VonBeruf\t'+
		'VonGender\t'+
		'VonPartei\t'+
		'AnUsername\t'+
		'AnBeruf\t'+
		'AnGender\t'+
		'AnPartei\t'+
	   	'Tweet\n', _);
   var tsdfirst = null;
   var first = true;
   var toffset = (new Date()).getTimezoneOffset() * 60000 * 2;
   var twdata = dbclient.collection('twdata', _);
   var cursor = twdata.find(_);
   for (var obj = cursor.nextObject(_); obj; obj = cursor.nextObject(_)) {
		process.nextTick(_);
	   	var d = new Date(Date.parse(obj.created_at));
		if (d < timeSpanStart || d > timeSpanStop) continue;
	   	var ts = (d.getTime() - toffset) / 1000;
	   	var tsday = Math.floor(ts / (24 * 60 * 60));
	   	var tshour = Math.floor((ts % (24 * 60 * 60)) / (60 * 60));
	   	if (first) { 
	   		tsdfirst = tsday;
	   		first = false; 
	   	}
	   	var tsdiff = tsday - tsdfirst + 8;
		var mentions = mentionTypes(obj.text);
		for(var mi = 0; mi < mentions.length; mi++) {
			var mention = mentions[mi];
		   	write_(res,
				mention.type + '\t' +
		   		localeDateString(d) + '\t' +
		   		tsdiff + '\t' + 
		   		tshour + '\t' +
		   		obj.user.screen_name + '\t' +
				userBeruf(obj.user.screen_name) + '\t' +
				userGender(obj.user.screen_name) + '\t' +
				userPartei(obj.user.screen_name) + '\t' +
		   		mention.user + '\t' +
				userBeruf(mention.user) + '\t' +
				userGender(mention.user) + '\t' +
				userPartei(mention.user) + '\t' +
		   		obj.text.replace(/\t/g,'\\t').replace(/\n/g,'\\n').replace(/\r/g,'') + '\n',
				_);
		}
	}
	util.log('end transmission');
	res.hasEnded = true;
	res.end();
}

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
	return ye+'-'+mo+'-'+da+'T'+ho+':'+mi+':'+se;
}

function mentionTypes(text) {
	var mentiontable = {};
	var mentions = [];
	var reg, ca;

	function parse(reg, type) {
		for(var ca = reg.exec(text); ca != null; ca = reg.exec(text)) {
			var mention = ca[1];
			if (mentiontable[mention]) continue;
			mentiontable[mention] = true;
			mentions.push({user: mention, type: type});
		}
	}

	// direct address 
	parse(/^@([A-z0-9_]+)/g, 2);
	
	// simple retweet
	parse(/^\s*RT @([A-z0-9_]+)/g, 3);

	// commented retweet
	parse(/RT @([A-z0-9_]+)/g, 4);

	// quote
	parse(/"@(\[A-z0-9_]+)/g, 4);

	// via				
	parse(/via\s+@([A-z0-9_]+)/g, 4);

	// normal mentions
	parse(/@([A-z0-9_]+)/g, 1);

	return mentions;
}

function webMentions(req, red, res, _) {
    var cookie = twit.cookie(req, res);
    if (!cookie) {
		res.writeHead(403, {'Content-Type': 'text/plain'});
		res.end('403 Not logged in');
		return;
	} 
	if (!userlist[cookie.screen_name]) {
		res.writeHead(403, {'Content-Type': 'text/plain'});
		res.end('403 Not in userlist');
		return;
    }
	res.writeHead(200, {'Content-Type': 'application/octet-stream'});
	var now = new Date();
	write_(res, '<?xml version="1.0" encoding="UTF-8"?>'+
		'<gexf xmlns="http://www.gexf.net/1.2draft" '+
			'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '+
			'xsi:schemaLocation="http://www.gexf.net/1.2draft http://www.gexf.net/1.2draft/gexf.xsd" '+
			'version="1.2">\n'+
		'<meta lastmodifieddate="'+now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+'">\n'+
		'  <creator>twaaaj</creator>\n'+
		'  <description>All mentions of users mentioning users</description>\n'+
		'</meta>\n'+
		'<graph defaultedgetype="directed" timeformat="dateTime">\n'+
		'  <attributes class="node">\n'+
		'     <attribute id="0" title="Beruf" type="integer"/>\n'+
		'     <attribute id="1" title="Gender" type="integer"/>\n'+
		'     <attribute id="2" title="Partei" type="integer"/>\n'+
		'  </attributes>\n'+
		'  <attributes class="edge">\n'+
		'     <attribute id="0" title="Tweettyp" type="integer"/>\n'+
		'  </attributes>\n'+
		'  <nodes>\n',
		_);
	var idlist = [];
	var idtable = {};
	res.write('<!-- userlist -->\n');
	for(var screenname in twittapoll) {
		var id = idlist.length;
		idlist.push(screenname);
		idtable[screenname] = id;
		write_(res,
			'    <node id="'+id+'" label="'+screenname+'">'+
			'<attvalues>'+
				'<attvalue for="0" value="'+userBeruf(screenname)+'"/>'+
				'<attvalue for="1" value="'+userGender(screenname)+'"/>'+
				'<attvalue for="2" value="'+userPartei(screenname)+'"/>'+
			'</attvalues>'+
			'</node>\n',
			_);
	}

	var twdata = dbclient.collection('twdata', _);
	var cursor = twdata.find(_);

	var tweets = [];
	for(var obj = cursor.nextObject(_); obj !== null; obj = cursor.nextObject(_)) {
		var screenname = obj.user.screen_name;
		var d = new Date(Date.parse(obj.created_at)).getTime();
		if (d < timeSpanStart || d > timeSpanStop) continue;
		var mentions = mentionTypes(obj.text);
		tweets.push({
			screenname: screenname, 
			text: obj.text, 
			created_at: obj.created_at,
			mentions: mentions,
		});
		if (typeof(idtable[screenname]) === 'undefined') {
			var id = idlist.length;
			idlist.push(screenname);
			idtable[screenname] = id;
			write_(res,
				'    <node id="'+id+'" label="'+screenname+'">'+
					'<attvalues>'+
						'<attvalue for="0" value="0"/>'+
						'<attvalue for="1" value="0"/>'+
						'<attvalue for="2" value="0"/>'+
					'</attvalues>'+
					'</node>\n',
				_);
		}
		if (typeof(idtable[screenname]) === 'undefined') {
			util.log('UNDEFINED');
			util.log(util.inspect(obj));
			process.exit(1);
		}
	
		for(var mi = 0; mi < mentions.length; mi++) {
			var user = mentions[mi].user;
			if (typeof(idtable[user]) !== 'undefined') continue;
			var id = idlist.length;
			idlist.push(user);
			idtable[user] = id;
			write_(res,
				'    <node id="'+id+'" label="'+screenname+'">'+
					'<attvalues>'+
						'<attvalue for="0" value="0"/>'+
						'<attvalue for="1" value="0"/>'+
						'<attvalue for="2" value="0"/>'+
					'</attvalues>'+
					'</node>\n',
				_);
		}
	}
	res.write('  </nodes>\n');
	var edges = [];
	var edgeidfactory = 0;
	res.write('  <edges>\n');

	//for(obj2 = cursor2.nextObject(_); obj2 !== null; obj2 = cursor2.nextObject(_)) {
	for(var ti = 0; ti < tweets.length; ti++) {
		//process.nextTick(_);
		//util.log(tweets.length);
		//util.log(ti);
		//util.log(util.inspect(tweets[ti]));
		var screenname = tweets[ti].screenname;
		var text       = tweets[ti].text;
		var created_at = tweets[ti].created_at;
		var mentions   = tweets[ti].mentions;
		for(var mi = 0; mi < mentions.length; mi++) {
			var mention = mentions[mi];
			if (typeof(idtable[mention.user]) === 'undefined' || typeof(idtable[screenname]) === 'undefined') {
				util.log('IMPOSSIBLE!');
				process.exit(1);
			}
			var start = new Date(Date.parse(created_at));
			var end   = new Date(start.getTime() + 60 * 1000);
			write_(res, '    <edge id="'+(++edgeidfactory)+'" source= "'+idtable[screenname]+'" target="'+idtable[mention.user]+'" '+
				'start="'+gexfDateString(start)+'" end="'+gexfDateString(end)+'">'+
				'<attvalues><attvalue for="0" value="'+ mention.type + '"/></attvalues>'+
				'</edge>\n', 
				_);
		}
	}
	write_(res,
		'  </edges>\n'+
		'</graph>\n'+
		'</gexf>\n',
		_);
	util.log('end transmission');
	res.hasEnded = true;
	res.end();
}
		
/**
| Dispatches a web request
*/
function webDispatch(req, red, res) {
	var w = null;
	req.connection.setKeepAlive(true);
	res.connection.setKeepAlive(true);

	req.on('error', function(err) {
		util.log('Req Stream error');
		util.log(util.inspect(err));
	});
	req.on('close', function(e1, e2) {
		util.log('Req Stream closed');
		util.log(util.inspect(e1));
		util.log(util.inspect(e2));
	});
	res.on('error', function(err) {
		util.log('Res Stream error');
		util.log(util.inspect(err));
	});
	res.on('close', function(err) {
		util.log('Res Stream closed');
		util.log(util.inspect(err));
	});
	switch(red.pathname) {
	case '/' :
	case '/index' :
	case '/index.html' :
		webIndex(req, red, res);
		return;
	case '/allhashes.tsv' :
		webAllHashesTsv(req, red, res, function(err) { if (err) throw err; });
		return;	
	case '/alltweets.tsv' :
		webAllTweetsTsv(req, red, res, function(err) { if (err) throw err; });
		return;	
	case '/allmentions.tsv' :
		webAllMentionsTsv(req, red, res, function(err) { if (err) throw err; });
		return;	
	case '/mentions.gexf' :
		webMentions(req, red, res, function(err) { if (err) throw err; });
		return;
//	case '/tracked_mentioning_tracked_static.gexf' :
//		webTrackedMentioningTrackedStatic(req, red, res, function(err) { if (err) throw err; });
//		return;
	case '/signin' :
		webSignin(req, red, res);
		return;
	case '/signout' :
		webSignout(req, red, res);
		return;
	}
	/* checks for all webRessources */
	var pathname = red.pathname;
	if (pathname[0] = '/') pathname = pathname.substr(1);
	if (webRessources[pathname]) {
		webRessource(req, red, res, webRessources[pathname], pathname);
		return;
	}
	util.log('404 '+red.pathname);
	web404(req, red, res);
}

function cvsNormalize(s) {
	if (typeof(s) === 'undefined') return 0;
	if (s === '') return 0;
	return s;
}

function readCSV(filename, array) {
	var csv = fs.readFileSync(filename, 'utf8');
	var lines = csv.split('\n');
	var head = ['username',null,'beruf','gender',null,'partei'];
	for (var li = 1; li < lines.length; li++) {
		var line = lines[li];
		var cols = line.split(',');
		if (cols.length <= 1) continue;
		var obj = {
			username : cols[0],
			beruf    : cvsNormalize(cols[2]),
			gender   : cvsNormalize(cols[3]),
			partei   : cvsNormalize(cols[5]),
		}
		if (!obj.username) {
			console.log('invalid username: '+obj.username);
			process.exit(1);
		}
		array[cols[0]] = obj;
	}
}


/**
| Startup sequence.
*/
function startup(_) {
	readCSV('./ATPolTwit.csv', twittapoll);
	util.log('Connecting to database');
	dbclient = dbconnector.open(_);
	util.log('Webserver listening on port '+port);

	var server = http.createServer(function (req, res) {
		var red = url.parse(req.url, true);
	    util.log('http reqest from '+req.connection.remoteAddress+' for: ' + red.href);
		webDispatch(req, red, res);
	});
	server.listen(port);
	server.on('clientError', function(err) { util.log('http client Error'); util.log(util.inspect(err)); });
	server.on('upgrade', function(req, sock, head) { util.log('upgrade request'); });;
}

try {
	startup(_);
} catch(err) {
	util.log(util.inspect(err));
}
