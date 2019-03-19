#!/usr/bin/env node

// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 1337;
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

const lastfmConfig = require('./config/lastfm')
require('./app/passport')(passport, lastfmConfig, port); // pass passport for configuration

var Radio = require('./app/radio');
var radio = new Radio(app, lastfmConfig);

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser('lastfmradiosecret')); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
})); // get information from html forms
app.use('/public', express.static('public'))

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'lastfmradiosecret',
    name: 'sessiondata',
    cookie: {secure: false},
    resave: false,
    saveUninitialized: true,
    maxAge: 1000 * 60 * 60 * 24
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes')(app, passport, radio); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
