twaaaj --- Twitter Archiver (Axel Axel Julian) 
==============================================

This is the twitter archiver used in projects of Axel Maireder, Axel
Kittenberger and Julian Aussenhofer. It tracks up to 400 twitter users by ID
(tweets send) as well as by mention (being mentioned) using the twitter
streaming API. The twitter search API is not used.

This projects uses following technologies:
 * node.js
 * mongodb
 * node-streamline

It contains a modified version of jdub/node-twitter. Changes are: use of
'cookies' module instead of 'cookie', use of 'keygrip' and fixes to the Twitter
API like forced use of https.  

The project contains of two parts. First a streamer 'stream-js'. It streams the
data from the Twitter API and puts its unmodified into the mongo database.
Secondly a web interface 'web_.js'. This is used to access the data from the
database and produces overviews, TSV (tab seperated values) data or Gephi data
files (.gefx). Splitting this services allows one to tinker with the web
service without harming the download stream.

This is a more a hack that develops as we need it than a finished OpenSource
product. Configuration is thus done simply directly in the source code.

Additional Files
----------------

Of course missing here is keys.js which contains the twitter API identification
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

The users to follow by the stream server are to be there in users.json and look
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

The webservice reads a CSV describing the users, these structures are very
dependand on the project on hand.
