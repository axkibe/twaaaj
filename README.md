twaaaj --- Twitter Archiver (Axel Axel Julian)
==============================================

This is the twitter archiver used in projects of Axel Maireder, Axel Kittenberger and Julian Aussenhofer. It tracks up to 400 twitter users by ID (tweets send) as well as by mention (being mentioned) using the twitter streaming API. The twitter search API is not used.

Following technologies are used:

* node.js
* mongodb
* node-streamline

This project contains a modified version of jdub/node-twitter. Changes are: use of 'cookies' module instead of 'cookie', use of 'keygrip' and fixes to the Twitter API like forced use of https.

Following node.js modules have to be installed with [npm](http://npmjs.org/)

```
npm install cookies
npm install keygrip
npm install mondodb
npm install oauth
```

The project consits of two parts. First part is a streamer 'stream.js'. It streams the data from the Twitter API and puts its unmodified into the mongo database. Run it in a [screen](http://www.gnu.org/s/screen/) to keep it running  like a daemon.

```
screen
node stream.js
CTRL+A d   (to detach from screen)
```

The second part is a web interface 'web_.js'. This is used to access the data from the database and produces overviews, TSV (tab seperated values) data or Gephi data files (.gefx).

Splitting this services allowed me to tinker with the web service without harming the download stream. The web interface uses 'node-streamline' so it has to be used instead of plain node. Also run it in a [screen](http://www.gnu.org/s/screen/) and this one likely needs superuser priviledges to be able to listen on port 80. Or change the port to something else greater than 1024.

```
screen
sudo node-streamline web_.js
CTRL+A D   (to deatch from screen)
```

This is a more a hack that develops as we need it than a finished product. Configuration is thus done directly in the source code on several occasions.

Additional Files
----------------

Of course missing here is keys.js which contains your Twitter API identification
secrets. It should look like this:

```
module.exports = {
	consumer_key: 'YOUR TWITTER API CONSUMER KEY',
	consumer_secret: 'YOUR TWITTER API CONSUMER SECRET',
	access_token_key: 'YOUR TWITTER API TOKEN KEY',
	access_token_secret: 'YOUR TWITTER API TOKEN SECRET',
	keygrip: 'A RANDOM STRING NOBODY WILL EVER GUESS',
}
```

The users to follow by the stream server are specified by 'users.json' and should look
like this:

```
[
 {
  "name": "max",
  "id": 123
 },
 {
  "name": "mustermann",
  "id": 456
 },
....
]
```

The webservice reads a CSV describing the users, which structure depends a lot on the project at hand.
