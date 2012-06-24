// Talk.Client
// =============

var Client = function(url) {
    this.ws = new WebSocket(url);
    this.sent = 0;
  };

  _.extend(Talk.Client.prototype, {

    ready: function(callback) {
      this.ws.onopen = callback;
    },

    on: function(event, fn) {
      if (event === "message") {
        return this.ws["onmessage"] = function(msg) { fn(JSON.parse(msg.data)); }
      }
      // Delegate
      this.ws["on"+event] = fn;
    },

    send: function(message, topic, callback) {
      this.sent += 1;
      this.ws.send(JSON.stringify(message));
    }
  });

// Export
// -------------

module.exports = Server;