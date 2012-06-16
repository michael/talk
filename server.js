var express = require('express');
var app     = express.createServer();
var fs      = require('fs');
var _       = require('underscore');

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

// Web Server
// =============

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname));
app.listen(3000);


console.log('Websocket Server started @ '+ config.server_port);

// Websocket Server
// =============

var TalkServer = function(port) {
  this.numClients = 0;
  this.clients = {};
  this.handlers = {};

  var WebSocketServer = require('ws').Server;

  this.wss = new WebSocketServer({ port: config.server_port });
  this.bindHandlers();
};

_.extend(TalkServer.prototype, {
  bindHandlers: function() {
    var that = this;

    this.wss.on('connection', function(ws) {

      that.openSession(ws);

      // Delegate
      ws.on('close',   function() { that.closeSession() });
      ws.on('message', function(message) {
        // console.log('messave received', message);
        that.handleMessage(ws, message);
      });
    });
  },

  // Register client on connect
  openSession: function(ws) {
    ws.id = this.numClients += 1;
    this.clients[ws.id] = ws;
  },

  // Register client on connect
  closeSession: function(ws) {
    delete this.clients[ws.id];
  },

  // Register message handler
  handleMessage: function(ws, message, fn) {
    console.log('received: %s', message);

    var message = JSON.parse(message);

    // Broadcast

    // Find handler
    var handler = this.handlers[message.command];

    console.log(message.command);

    if (handler) handler.call(this, ws, message);
    // var clients = route(message, ws);
    
    // clients.forEach(function(client) {
    //   client.send(JSON.stringify(message));
    // });
  },

  // Register handler for paricular operation
  handle: function(op, fn) {
    this.handlers[op] = fn;
    console.log('handling ... ', op);
  }
});

var talk = new TalkServer(3100);

// Open documents
var documents = {};

function joinDocument(socket, document) {
  console.log('joining document');
}

talk.handle('document:create', function(socket, message, cb) {
  console.log('handler.. doc:create called', message.name);
  joinDocument(socket, message.name);

  // Client response
  if (cb) cb(null, {"status": "ok"});
});

talk.handle('document:open', function(socket, message, cb) {
  
});

talk.handle('document:open', function(socket, message, cb) {
  
});

talk.handle('node:insert', function(socket, message, cb) {
  console.log('inserting a node');

  // TODO: broadcast to all concerned clients
  this.wss.clients.forEach(function(client) {
    client.send(JSON.stringify(message));
  });

  // Client response
  if (cb) cb(null, {"status": "ok"});
});
