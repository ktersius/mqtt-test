'use strict';
//Setup mosca
var mosca = require('mosca');

var ascoltatore = {
  //using ascoltatore
  type: 'mongo',
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}

};

var settings = {
  backend: ascoltatore
};

var moscaServer = new mosca.Server(settings);

moscaServer.authorizeSubscribe = function (client, topic, callback) {
  console.log('auth subscribe client %s, user %s , topic %s', client.id, client.user, topic);
  callback(null, true);
}

moscaServer.on('clientConnected', function (client) {
  console.log('client connected', client.id);
});

// fired when a message is received
moscaServer.on('published', function (packet, client) {
  console.log('Published', packet.payload);
});

moscaServer.on('ready', function() {
  console.log('Mosca server is up and running');
});


//Setup Express
var express = require('express');
var app = express();

app.use(express.static('public'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  moscaServer.attachHttpServer(server);

  console.log('Example app listening at http://%s:%s', host, port);
});


//Setup some publishing

setInterval(function () {
  var payLoad = 'MQTT Message : ' + new Date().toISOString();
  var message = {
    topic: 'UserChange',
    payload: payLoad, // or a Buffer
    qos: 1, // 0, 1, or 2
    retain: false // or true
  };

  moscaServer.publish(message, function() {
    //console.log('Published message');
  });
}, 5000);
