var express = require('express');
var redis = require('redis');

var app = express();

var client = redis.createClient();

app.use(function (req, res, next){
  //TODO: INCR counter in redis
  client.incr('counter', function (err, counter){
    if(err){
    return next(err);
    }
    res.locals.counter = counter;
    next();
  });
});

app.get('/', function (req, res){
  res.send('Hello visitor #' + res.locals.counter);
});

app.use(function (err, req, res, next){
  if (err){
    res.status(500).send('Something bad happened ..');
    console.log(err);
  }
});

client.on('connect', function (){
  console.log('connected to redis');
  //purposely not creating another callback function
  initializeCounter(connectToServer);
});

client.on('end', function (){
  console.log('disconnect from redis');
  //client.end();
});

function initializeCounter (callback){
  client.get('counter', function (err, counter){
    if (err){ throw err;}
    if (!counter){
      client.set('counter', 0);
    }
    return callback(); //connect to the server
  });
}

function connectToServer (){
  var server = app.listen(3000, function (){
    console.log('Server is listening', server.address().port);
  });
}

