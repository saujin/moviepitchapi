require('dotenv').config({silent: true});
var http = require('http');
var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var auth = require('./auth/index.js');
var controllers = require('./controllers/index.js');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({extended: false}));
app.use(expressValidator());

app.set('port', (process.env.PORT || 3000));
console.log('Starting app at port %s', app.get('port'));
var server = app.listen(app.get('port'), function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
  console.log('Connected to database ' + process.env.MONGOLAB_URI)
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
  res.header("Access-Control-Allow-Headers",
     "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  next();
});

auth.init(app);
controllers.init(app);
module.exports = server
