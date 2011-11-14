/**
| Axels TwapperKeeper Inquirer 
| This gets data from Twapperkeeper SQL database and analyzes it.
*/
var sys   = require('sys');
var http  = require('http');
var url   = require('url');
var mysql = require('db-mysql');
var fs    = require('fs');
var ip    = 'x.x.x.x YOUR IP';
var port  = 8080;

function log(text) {
	text = (new Date()) + ": " + text;
	console.log(text);
}

var db = new mysql.Database({
    hostname: 'localhost',
    user: 'root',
    password: 'YOUR PASSWORD',
    database: 'ytk'
})

var serverError = function(res, code, content) {
	res.writeHead(code, {'Content-Type': 'text/plain'});
	res.end(content);
}

var writeHeadEnd = function(res, type, content, format) {
	res.writeHead(200, {'Content-Type': type});
	res.end(content, 'utf-8');
} 

var midnight = function(s) {
	var d = new Date(s * 1000);
	return (new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)) / 1000;
}

var sg11 = function(req, res, up) {
	res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<!DOCTYPE HTML>\n');
    res.write('<html>\n');
    res.write('<head>\n');
    res.write('<title>Twapper Inquire</title>\n');
	res.write('<link href="inquire.css" rel="stylesheet" type="text/css">\n');
	res.write('<meta http-equiv="content-type" content="text/html;charset=utf-8"/>');
    res.write('</head>\n');
    res.write('<body>\n');
    if (up.query.pw != "1inquire") {
        res.write('Please retry with password\n');
    	res.write('</body>\n');
	    res.end('</html>');
    	return;   
    } 
	var alist = up.query.alist;
	if (!alist) {
        res.write('Archive list missing\n');
    	res.write('</body>\n');
	    res.end('</html>');
    	return;   
	}
	var alistQ = alist;
	alist = alist.split('z');
db.connect(function(error) {
	if (error) {
		log('Connection error' + error);
		res.write('Connection error' + error + '\n');
        res.end('</body></html>\n');
		return;
	}
db.query().
	select('*').
	from('archives').
	execute(
function(error, rows, cols) {
	console.log('got archives list');
	if (error) {
		log('Mysql error' + error);
		res.write('SQL error' + error + '\n');
        res.end('</body></html>\n');
		return;
	}
	var metaRows = rows;
	var metaCols = cols;
	var archives = [];
var yield = function() {
	// called when all archives are read 
	var spday = 60*60*24;
	var qbegin = up.query.begin.split('-');
	var qend = up.query.end.split('-');
	var fnight = new Date(qbegin[0], qbegin[1] - 1, qbegin[2], 0, 0, 0, 0);
	var lnight = new Date(qend  [0], qend  [1] - 1, qend  [2], 0, 0, 0, 0);
	var ft = fnight / 1000;
	var lt = lnight / 1000;
	
	res.write('<div>begin: '+fnight+'</div>');
	res.write('<div>end:   '+lnight+'</div>');
	res.write('<div>archives: ');
	for(var a in archives) {
		if (a > 0) res.write(', ');
		res.write(archives[a].keyword);
	}
	res.write('</div>');

	var all = [];
	var keys = {};
	var atweets = [];

	for(var a in archives) {
		var arch = archives[a];
		var keyword = arch.keyword;
		if (!keys[keyword]) keys[keyword] = [];
		log('aquiring '+keyword);
		for(var ar in arch.rows) {
			var row = arch.rows[ar];
			var time = row.time * 1;
			if (time < ft || time > lt) {
				continue;
			}
			var dupl = false;
			if (keys[keyword][row.id]) {
				// dupl
				continue;
			}
			row.keyword = keyword;
			all[all.length] = row;
			keys[keyword][row.id] = row;
			if (!atweets[row.id]) {
				atweets[row.id] = row;
			}
		}
	}

	var atweetn = 0;
	for (var a in atweets) {
		atweetn++;
	}
	res.write('<div>tweets/keywords '+all.length+'</div>');
	res.write('<div>unique tweets: '+atweetn+'</div>');

	log('sorting tweets');
	all.sort(function(a, b){return (a.time * 1) - (b.time * 1);});
	log('done');
	var users = {};

	for(a in all) {
		var row = all[a];
		var keyword = row.keyword;
		var user = users[row.from_user] || (users[row.from_user] = {
			tweets   : [],
			keywords : [],
			days     : [],
		});
		user.tweets[user.tweets.length] = row;

		if (!user.keywords[keyword]) user.keywords[keyword] = [];
		user.keywords[keyword][user.keywords[keyword].length] = row;
		
		var mn = midnight(row.time);
		if (!user.days[mn]) user.days[mn] = {
			tweets   : [],
			keywords : [],
		}
		
		user.days[mn].tweets[user.days[mn].tweets] = row;
		if (!user.days[mn].keywords[keyword]) user.days[mn].keywords[keyword] = [];
		user.days[mn].keywords[keyword][!user.days[mn].keywords[keyword].length] = row;
	}


	// ordered user list and counts	
	ulist = [];
	for (var u in users) {
		ulist[ulist.length] = u;
		var kn = 0;	
		for (var _ in users[u].keywords) {
			kn++;
		}
		users[u].kn = kn;

		var dn = 0; 
		var dkn = 0; // keywords per day per user
		for (var d in users[u].days) {
			dn++;
			for (var _ in users[u].days[d].keywords) {
				dkn++;
			}
		}
		users[u].dn = dn;
		users[u].dkn = dkn;
	}

	if (up.query.request === "tweets-user") {
		res.write('<h1>Tweets/User</h1>\n');
	} else {
		res.write('<div><a href="/sg11?pw=1inquire&begin='+
			up.query.begin+'&end='+up.query.end+
			'&alist='+alistQ+'&request=tweets-user">Tweets/User</a></div>');
	}

	if (up.query.request === "keywords-user") {
		res.write('<h1>Keywords/User</h1>\n');
	} else {
		res.write('<div><a href="/sg11?pw=1inquire&begin='+
			up.query.begin+'&end='+up.query.end+
			'&alist='+alistQ+'&request=keywords-user">Keywords/User</a></div>');
	}

	if (up.query.request === "daystweeted-user") {
		res.write('<h1>Days Tweeted/User</h1>\n');
	} else {
		res.write('<div><a href="/sg11?pw=1inquire&begin='+
			up.query.begin+'&end='+up.query.end+
			'&alist='+alistQ+'&request=daystweeted-user">Days Tweeted/User</a></div>');
	}
	
	if (up.query.request === "days-keywords-user") {
		res.write('<h1>Keywords/Day/User</h1>\n');
	} else {
		res.write('<div><a href="/sg11?pw=1inquire&begin='+
			up.query.begin+'&end='+up.query.end+
			'&alist='+alistQ+'&request=days-keywords-user">Keywords/Day/User</a></div>');
	}

	if (up.query.request === "keywords-mul-tweets-user") {
		res.write('<h1>>Keywords*Tweets/User</h1>\n');
	} else {
		res.write('<div><a href="/sg11?pw=1inquire&begin='+
			up.query.begin+'&end='+up.query.end+
			'&alist='+alistQ+'&request=keywords-mul-tweets-user">Keywords*Tweets/User</a></div>');
	}


	if (up.query.request === "all-tweets") {
		res.write('<h1>All Tweets</h1>\n');
	} else {
		res.write('<div><a href="/sg11?pw=1inquire&begin='+
			up.query.begin+'&end='+up.query.end+
			'&alist='+alistQ+'&request=all-tweets">All Tweets</a></div>');
	}

	if (up.query.request === "tweets-user") {
		ulist.sort(function(a,b){return users[b].tweets.length - users[a].tweets.length});
		res.write('<table>\n');
		res.write('<tr>');
		res.write('<th>user</th>');
		res.write('<th>#tweets</th>');
		for (var a in archives) {
			var arch = archives[a];
			res.write('<th>'+arch.keyword+'</th>');
		}
		res.write('</tr>\n');
		for (var u in ulist) {
			res.write('<tr>');
			var user = ulist[u];
			res.write('<td><a href="javascript:window.open(\'/sg11?pw=1inquire&begin='+
				up.query.begin+'&end='+up.query.end+
				'&alist='+alistQ+'&request=user&user='+user+'\');">'+user+'</td>');
			res.write('<td>'+users[user].tweets.length+'</td>');
			for (var a in archives) {
				var arch = archives[a];
				var keywtweets = users[user].keywords[arch.keyword]  
				var klen = keywtweets ? keywtweets.length : 0;
				res.write('<td>'+klen+'</td>');
			}
			res.write('</tr>\n');
		}
		res.write('</table>\n');
	}

	if (up.query.request === "keywords-user") {
		ulist.sort(function(a,b){return users[b].kn - users[a].kn});
		res.write('<table>\n');
		res.write('<tr>');
		res.write('<th>user</th>');
		res.write('<th>#keywords</th>');
		res.write('<th>#tweets</th>');
		for (var a in archives) {
			var arch = archives[a];
			res.write('<th>'+arch.keyword+'</th>');
		}
		res.write('</tr>\n');
		for (var u in ulist) {
			res.write('<tr>');
			var user = ulist[u];
			res.write('<td><a href="javascript:window.open(\'/sg11?pw=1inquire&begin='+
				up.query.begin+'&end='+up.query.end+
				'&alist='+alistQ+'&request=user&user='+user+'\');">'+user+'</td>');
			res.write('<td>'+users[user].kn+'</td>');
			res.write('<td>'+users[user].tweets.length+'</td>');
			for (var a in archives) {
				var arch = archives[a];
				var keywtweets = users[user].keywords[arch.keyword]  
				var klen = keywtweets ? keywtweets.length : 0;
				res.write('<td>'+klen+'</td>');
			}
			res.write('</tr>\n');
		}
		res.write('</table>\n');
	}
	
	if (up.query.request === "keywords-mul-tweets-user") {
		ulist.sort(function(a,b){return (users[b].kn*users[b].tweets.length) - (users[a].kn*users[a].tweets.length)});
		res.write('<table>\n');
		res.write('<tr>');
		res.write('<th>+</th>');
		res.write('<th>user</th>');
		res.write('<th>#keywords*#tweets</th>');
		res.write('<th>#keywords</th>');
		res.write('<th>#tweets</th>');
		for (var a in archives) {
			var arch = archives[a];
			res.write('<th>'+arch.keyword+'</th>');
		}
		res.write('</tr>\n');
		for (var u in ulist) {
			res.write('<tr>');
			var user = ulist[u];
			res.write('<td>'+((u*1) + 1)+'</td>');
			res.write('<td><a href="javascript:window.open(\'/sg11?pw=1inquire&begin='+
				up.query.begin+'&end='+up.query.end+
				'&alist='+alistQ+'&request=user&user='+user+'\');">'+user+'</td>');
			res.write('<td>'+(users[user].kn*users[user].tweets.length)+'</td>');
			res.write('<td>'+users[user].kn+'</td>');
			res.write('<td>'+users[user].tweets.length+'</td>');
			for (var a in archives) {
				var arch = archives[a];
				var keywtweets = users[user].keywords[arch.keyword]  
				var klen = keywtweets ? keywtweets.length : 0;
				res.write('<td>'+klen+'</td>');
			}
			res.write('</tr>\n');
		}
		res.write('</table>\n');
	}
	
	if (up.query.request === "daystweeted-user") {
		ulist.sort(function(a,b){return users[b].dn - users[a].dn});
		res.write('<table>\n');
		res.write('<tr>');
		res.write('<th>user</th>');
		res.write('<th>#days</th>');
		res.write('<th>#tweets</th>');
		for (var a in archives) {
			var arch = archives[a];
			res.write('<th>'+arch.keyword+'</th>');
		}
		res.write('</tr>\n');
		for (var u in ulist) {
			res.write('<tr>');
			var user = ulist[u];
			res.write('<td><a href="javascript:window.open(\'/sg11?pw=1inquire&begin='+
				up.query.begin+'&end='+up.query.end+
				'&alist='+alistQ+'&request=user&user='+user+'\');">'+user+'</td>');
			res.write('<td>'+users[user].dn+'</td>');
			res.write('<td>'+users[user].tweets.length+'</td>');
			for (var a in archives) {
				var arch = archives[a];
				var keywtweets = users[user].keywords[arch.keyword]  
				var klen = keywtweets ? keywtweets.length : 0;
				res.write('<td>'+klen+'</td>');
			}
			res.write('</tr>\n');
		}
		res.write('</table>\n');
	}
	
	if (up.query.request === "days-keywords-user") {
		ulist.sort(function(a,b){return users[b].dkn - users[a].dkn});
		res.write('<table>\n');
		res.write('<tr>');
		res.write('<th>user</th>');
		res.write('<th>#keywords/day</th>');
		res.write('<th>#tweets</th>');
		for (var a in archives) {
			var arch = archives[a];
			res.write('<th>'+arch.keyword+'</th>');
		}
		res.write('</tr>\n');
		for (var u in ulist) {
			res.write('<tr>');
			var user = ulist[u];
			res.write('<td><a href="javascript:window.open(\'/sg11?pw=1inquire&begin='+
				up.query.begin+'&end='+up.query.end+
				'&alist='+alistQ+'&request=user&user='+user+'\');">'+user+'</td>');
			res.write('<td>'+users[user].dkn+'</td>');
			res.write('<td>'+users[user].tweets.length+'</td>');
			for (var a in archives) {
				var arch = archives[a];
				var keywtweets = users[user].keywords[arch.keyword]  
				var klen = keywtweets ? keywtweets.length : 0;
				res.write('<td>'+klen+'</td>');
			}
			res.write('</tr>\n');
		}
		res.write('</table>\n');
	}

	if (up.query.request === "user") {
		var quser = up.query.user;
		res.write('<h1>User: <a href="http://twitter.com/'+quser+'">'+quser+'</a></h1>');
		res.write('<h2>Tweets:</h2>');
		var d = 0;
		res.write('<table>');
		res.write('<tr>\n');
		res.write('<th>keyword</th>\n');
		res.write('<th>from</th>\n');
		res.write('<th>text</th>\n');
		res.write('<th>time</th>\n');
		res.write('</tr>\n');
		for(t in users[quser].tweets) {
			var tweet = users[quser].tweets[t];
			if (tweet.time > d + spday) {
				d = tweet.time - (tweet.time % spday);
				var dd = new Date(d * 1000);
				res.write('<tr>');
				res.write('<td colspan="4" style="text-align: center; background: lightgray"><b>'+
					dd.getDate()+'.'+(dd.getMonth()+1)+'.'+dd.getFullYear()+'</b></td>');
				res.write('</tr>');
			}
			res.write('<tr>');
			res.write('<td>'+tweet.keyword+'</td>');
			res.write('<td>'+tweet.from_user+'</td>');
			res.write('<td>'+tweet.text+'</td>');
			res.write('<td>'+(new Date(tweet.time*1000)).toLocaleTimeString()+'</td>');
			res.write('</tr>');
		}
		res.write('</table>\n');
	}
	

	/*{
		res.write('<h1>Tweets/User/Day</h1>\n');
		var users = [];
		for(var r in rows) {
			var uname = rows[r].from_user;
			var urow;
			if (!users[uname]) {
				urow = users[uname] = [];
			} else {
				urow = users[uname];
			}
			var time  = rows[r].time;
			var mtime = midnight(time);
			if (!urow[mtime]) {
				urow[mtime] = 1;	
			} else {
				urow[mtime]++;
			}
		}

		// counts the days a user tweeted
		var usort = [];
		for(var u in users) {
			usort[usort.length] = u;
			var urow = users[u];
			urow.days = 0;
			for (ur in urow) {
				if (ur == 'days') continue;
				urow.days++;
			}
		}

		usort.sort(function(a, b) { return users[b].days - users[a].days;});

		res.write('<table>');
		res.write('<tr>');
		res.write('<th>user</th>');
		res.write('<th>days tweeted</th>');
		for(var d = fnight; d <= lnight; d += spday) {
			var dd = new Date(d*1000); 
			res.write('<th>'+dd.getDate()+'.'+(dd.getMonth()+1)+'</th>');
		}
		res.write('</tr>');
		for(var us in usort) {
			var u = usort[us];
			var urow = users[u];
			res.write('<tr>');
			res.write('<td>'+u+'</td>');
			res.write('<td>'+urow.days+'</td>');
			for(var d = fnight; d <= lnight; d += spday) {
				var ud = urow[d] ? urow[d] : 0;
				res.write('<td>'+ud+'</td>');
			}
			res.write('</tr>');
		}
		res.write('</table>');
	}*/
	if (up.query.request === "all-tweets") {
		var d = 0;
		//res.write('<h2>'+dd.getDate()+'.'+(dd.getMonth()+1)+'.'+dd.getFullYear()+'</h2>');
		//for(var d = fnight; d <= lnight; d += spday) {
		//var dd = new Date(d*1000); 
		res.write('<table>');
	    res.write('<tr>\n');
		res.write('<th>keyword</th>\n');
		res.write('<th>from</th>\n');
		res.write('<th>text</th>\n');
		res.write('<th>time</th>\n');
	    res.write('</tr>\n');
		for(a in all) {
			var tweet = all[a];
			if (tweet.time > d + spday) {
				d = tweet.time - (tweet.time % spday);
				var dd = new Date(d * 1000);
				res.write('<tr>');
				res.write('<td colspan="4" style="text-align: center; background: lightgray"><b>'+
					dd.getDate()+'.'+(dd.getMonth()+1)+'.'+dd.getFullYear()+'</b></td>');
				res.write('</tr>');
			}
			res.write('<tr>');
			res.write('<td>'+tweet.keyword+'</td>');
			var user = tweet.from_user;
			res.write('<td><a href="javascript:window.open(\'/sg11?pw=1inquire&begin='+
				up.query.begin+'&end='+up.query.end+
				'&alist='+alistQ+'&request=user&user='+user+'\');">'+user+'</td>');
			res.write('<td>'+tweet.text+'</td>');
			res.write('<td>'+(new Date(tweet.time*1000)).toLocaleTimeString()+'</td>');
			res.write('</tr>');
		}
		res.write('</table>\n');
	}

	res.end('</body></html>\n');
	return;
}

	for(var a in alist) {
		var z = alist[a];
		db.query().
			select('*').
			from('z_'+z).
			order({time: true}).
			execute(
	function(zz) { return function(error, rows, cols) {
		var keyword = null;
		for (var mr in metaRows) {
			if (metaRows[mr].id == zz) {
				keyword = metaRows[mr].keyword;
				log('got results for z_'+zz+': '+keyword);
				break;
			}
		}
		if (error) {
			log('Mysql error' + error);
			res.write('SQL error' + error + '\n');
	        res.end('</body></html>\n');
			return;
		}
		archives[archives.length] = {
			z: zz,
			keyword: keyword,
			rows: rows,
			cols: cols,
		}
		if (archives.length == alist.length) {
			log('all archives yielding');
			yield();
		}
	}}(z))
}})})}


console.log('Starting server at http://'+ip+':'+port);
http.createServer(function (req, res) {
    var up = url.parse(req.url, true);
	log(req.connection.remoteAddress + ' requests ' + up.href);
	log(up.pathname);
   	switch(up.pathname) {
	case '/sg11' : 
		sg11(req, res, up); 
		break;
    case '/inquire.css' :
		fs.readFile('./inquire.css', function(error, content) {
			if (error) { serverError(res, 500, 'File not there.'); return; }
			writeHeadEnd(res, 'text/css', content, 'utf-8');
		});
		break;
	default :
		serverError(res, 404, '404 Bad Request');
    }
}).listen(port, ip, function() {
	log('Server running at http://'+ip+':'+port);
});

