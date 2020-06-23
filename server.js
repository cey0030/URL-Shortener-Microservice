'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var dns = require('dns')
var dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

var cors = require('cors');
const { Hash } = require('crypto');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// Start of challenge code 
mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })

var Schema = mongoose.Schema
var urlSchema = new mongoose.Schema({
  url: String
})

var Url = mongoose.model('Url', urlSchema)
// End of challenge code 

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
// Start of challenge code 
app.use(bodyParser.urlencoded({ extended: false }));
// End of challenge code 
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// Start of challenge code 
app.post('/api/shorturl/new/', function (req, res) {
  var long_url = req.body.url

  dns.lookup(long_url, (err, address, family) => {
    if(!address || !family) {
      res.json({"error":"invalid URL"})
    } else {
      var url = new Url({
        url: long_url
      })
      url.save((error) => {
        if (error) console.log(error)
      })
      res.json({"original_url":long_url,"short_url":mongo.ObjectID})
    }
  })
})

app.get('/api/shorturl/new/:url_id?', function (req, res) {
  Url.findById({
    _id: req.params.url_id
  }, (error, data) => {
    if (error) {
      res.json({'error': 'invalid URL'})
    } else {
      res.redirect('https://' + data.url)
    }
  })
})
// End of challenge code 

app.listen(port, function () {
  console.log('Node.js listening ...');
});
