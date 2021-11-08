var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// to get variables from .env file
require('dotenv').config();

// for login/cookie handling
const JwtStrategy = require('passport-jwt').Strategy;
const passport = require('passport');
const CookieExtractor = require('./security/cookieExtractor');

const opts = {}
opts.jwtFromRequest = CookieExtractor.cookieExtractor;
opts.secretOrKey = process.env.AUTH_SECRET;

// get details for user to be used across site
// not creating extra function to search for user every time we need the role
passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
  // add the findUser function to get the details for a user given their username
  // userService.findUser(jwt_payload['user'].username, function(err, user) {
  //     if (err) {
  //         return done(err, null);
  //     }
  //     return done(null, user);
  // });
  // const user = await userService.findUser(jwt_payload['user'].username);

  // insead of searching for user every time, 
  return done(null, jwt_payload['user']);
})); 

var index = require('./routes/index');
var users = require('./routes/users');
var quizzes = require('./routes/quizzes');
var questions = require('./routes/questions');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use('/', index);
app.use('/users', users);
app.use('/quizzes', quizzes);
app.use('/questions', questions);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
