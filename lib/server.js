// Talk.Server
// =============

var Server = function(port) {
  this.numClients = 0;
  this.clients = {};
  this.handlers = {};

  var WebSocketServer = require('ws').Server;

  this.wss = new WebSocketServer({ port: config.server_port });
  this.bindHandlers();
};

_.extend(Server.prototype, {
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


// Export
// =============

module.exports = Server;