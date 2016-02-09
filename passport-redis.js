var path = require('path');
var morgan = require('morgan');
var passport = require('passport');
var express = require('express');
var app = express();
var redis = require('redis');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var config = require('./config');
//passing another middleware (session) into RedisStore
var RedisStore = require('connect-redis')(session);

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');


app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
  //secret object
  secret: config.session.secret,
  //switch from 'in memory store' to RedisStore//
  //see optios in docs for parameters
  store: new RedisStore({
    //redis-cli to activate redis and see IP:port >
    //can either be localhost or IP
    host: '127.0.0.1',
    port: '6379'
  })
}));

app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  {
    passReqToCallback: true
  },
  //1st parameter 'req' to access the req in the callBack
  function (req, username, password, done) {
    var body = req.body;
    var info = {
      value: "food",
    };
    //add additional info from req.body (everything that's not password and username)
    //passing on additional info to the serialize user
    //info already passed through
    return done(null, info);
  }
));

passport.serializeUser(function (user, done){
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function (user, done){
  return done(null, user);
});

app.use(express.static(path.resolve(__dirname, 'public')));
//this is why need a views mkdir
//for jade to work needs to come from views
app.set('views', 'views');
app.set('view engine', 'jade');

app.get('/', function (req, res){
  console.log(req.user);
  //req.user to access user authenticated through serialize
  if(!req.user){
    return res.redirect('/info');
  }
  res.json(req.user);
});

app.get('/info', function (req, res){
  res.render('login');
});

app.post('/info',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/info'
  })
);

var server = app.listen(3000, function (){
  //TOClarify: rename from server? No need
  console.log('Server is listening', server.address().port);
});