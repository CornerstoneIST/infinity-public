var express = require('express');

var app = express(express.logger());

app.get('/', function(request, response) {
  response.send('Hello World!!');
});

var pg = require('pg');

pg.connect(process.env.DATABASE_URL, function(err, client) {
  var query = client.query('SELECT * FROM your_table');

  query.on('row', function(row) {
    console.log(JSON.stringify(row));
  });
});

var mongo = require('mongodb');

var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://heroku_app14221325:mm8d0q78tmfmjro3qi0rgti9k4@ds043497.mongolab.com:43497/heroku_app14221325'; 

mongo.Db.connect(mongoUri, function (err, db) {
  db.collection('mydocs', function(er, collection) {
    collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
    });
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});