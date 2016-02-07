var redis = require('redis');

//connect to redis (default configurations 127.0.0.1.:6379)
var client = redis.createClient();

client.on('ready', function (){
  console.log('Ready to go!');
});

client.on('connect', function (){
  runExample();
});

client.on('end', function (){
  console.log('goodbye redis');
  //without this, redis will keep running (activity monitor)
  client.end();
});

client.on('error', function (){
  console.log(error);
});

function runExample (){
  client.set('name', 'Gail');
  client.get('secret', function (err, secret){
    if(err){
      return;
    }
    console.log('the secret is....', secret);
  });
}