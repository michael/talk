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
  this.callbacks = {};

  var WebSocketServer = require('ws').Server;

  this.wss = new WebSocketServer({ port: port });
  this.bindHandlers();
};

_.extend(Server.prototype, {

  // Register handler for particular operation
  // -------------

  openLine: function(ws) {
    ws.id = this.numClients += 1;
    this.lines[ws.id] = new Line(ws);
  },

  // Close the line
  // -------------

  closeLine: function(ws) {
    if (this.callbacks.close) this.callbacks.close(this.lines[ws.id]);
    delete this.lines[ws.id];
  },


  // Delegate event handlers
  // -------------

  bindHandlers: function() {
    var that = this;

    this.wss.on('connection', function(ws) {
      that.openLine(ws);

      // Delegate events
      ws.on('close',   function() { that.closeLine(ws); });
      ws.on('message', function(message) {
        that.handleMessage(ws, message);
      });
    });
  },


  // Broadcast message
  // -------------

  broadcast: function(message) {
    _.each(this.lines, function(line) {
      line.send(message);
    });
  },


  // Handle message
  // -------------

  handleMessage: function(ws, message, fn) {
    var message = JSON.parse(message);
    
    // Find handler
    var handler = this.handlers[message[0]];

    if (handler) {
      // Callbacks are optional, they are used to send a response to the client
      handler.call(this, this.lines[ws.id], message[1], function(err, data) {
        ws.send(JSON.stringify(["response", data, message[2]]));
      });
    }
  },


  // Register handler for particular operation
  // -------------

  handle: function(method, fn) {
    this.handlers[method] = fn;
    console.log('handling ... ', method);
  },

  on: function(event, fn) {
    this.callbacks[event] = fn;
  }
});

// Export
// -------------

module.exports = Server;