/**
 * Created by tersiusk on 1/6/16.
 */

var clientId = 'browser123';
var client = mqtt.connect("ws://ubuntuvm:3000", {clean: false, clientId: clientId});

client.on('connect', function () {
  console.log('mqtt client connected');
  client.subscribe("UserChange", {qos: 1});
});

client.on('error', function (error) {
  console.log(error);
});

client.on('reconnect', function (error) {
  console.log('reconnecting');
});

client.on('message', function (topic, message, packet) {
  console.log(message.toString());
});

