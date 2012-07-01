var _ = require('underscore');


// Talk.Line
// =============

var Line = function(ws) {
  var that = this;
  this.id = ws.id;
  this.ws = ws;

  // Send a message to this line
  this.send = function(message) {
    ws.send(JSON.stringify(message));
  }
};

// Talk.Server
// =============

var Server = function(port) {
  this.numClients = 0;
  this.clients = {};
  this.lines = {};
  this.handlers = {};

  var WebSocketServer = require('ws').Server;

  this.wss = new WebSocketServer({ port: port });
  this.bindHandlers();
};

_.extend(Server.prototype, {
  bindHandlers: function() {
    var that = this;

    this.wss.on('connection', function(ws) {
      that.openLine(ws);

      // Delegate events
      ws.on('close',   function() { that.closeLine(ws) });
      ws.on('message', function(message) {
        that.handleMessage(ws, message);
      });
    });
  },

  // Register a new open line
  openLine: function(ws) {
    ws.id = this.numClients += 1;
    this.clients[ws.id] = ws; // legacy
    this.lines[ws.id] = new Line(ws);
  },

  // Register client on connect
  closeLine: function(ws) {
    delete this.clients[ws.id]; // legacy
    delete this.lines[ws.id];
  },

  // Send to all
  broadcast: function(message) {
    // TODO: implement
  },

  // Register message handler
  handleMessage: function(ws, message, fn) {
    var message = JSON.parse(message);
    
    // Find handler
    var handler = this.handlers[message.command];

    if (handler) {
      // Callbacks are optional, they are used to send a response to the client
      handler.call(ctx, this.lines[ws.id], message, function(err, response) {
        response.type = "response";
        response.command = message.response;
        response.mid = message.mid;
        ws.send(JSON.stringify(response));
      });
    }
  },

  // Register handler for paricular operation
  handle: function(op, fn) {
    this.handlers[op] = fn;
    console.log('handling ... ', op);
  }
});

// Export
// -------------

module.exports = Server;