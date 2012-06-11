var express = require('express');
var app     = express.createServer();
var fs      = require('fs');
// var agent   = new (require('./agent.js'))(app);

// Load config defaults from JSON file.
// Environment variables override defaults.
function loadConfig() {
  var config = JSON.parse(fs.readFileSync(__dirname+ '/config.json', 'utf-8'));
  for (var i in config) {
    config[i] = process.env[i.toUpperCase()] || config[i];
  }

  console.log('Configuration');
  console.log(config);
  return config;
}

var config = loadConfig();
var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: config.server_port });


// Web Server
// =============

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname));
app.listen(3000);


console.log('Websocket Server started @ '+ config.server_port);


// Websocket Server
// =============

// var talk = new Talk.Server();

// State
var state = {};

// Router

var route = function(message, ws) {
  // which clients should get it
  // Depending on the state of ws (maybe it has)
  console.log(message);
  return wss.clients;
}

var clients = {};
var numClients = 0;


wss.on('connection', function(ws) {

  // Register client
  ws.id = numClients += 1;
  clients[ws.id] = ws;

  // console.log(wss.clients);
  ws.on('message', function(message) {
    console.log('received: %s', message);

    var message = JSON.parse(message);
    // Broadcast
    var clients = route(message, ws);
    
    clients.forEach(function(client) {
      client.send(JSON.stringify(message));
    });
  });

  ws.on('close', function() {
    delete clients[ws.id];
  });
});
