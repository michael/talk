//     (c) 2012 Michael Aufreiter
//     Talk.js is freely distributable under the MIT license.
//     For all details and documentation:
//     http://substance.io/michael/talk

(function(){

  // Initial Setup
  // -------------

  // The top-level namespace. All public Talk.js classes and modules will
  // be attached to this. Exported for both CommonJS and the browser.
  var Talk;
  if (typeof exports !== 'undefined') {
    Talk = exports;
  } else {
    Talk = this.Talk = {};
  }
  
  // Current version of the library. Keep in sync with `package.json`.
  Talk.VERSION = '0.1.0';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = this._;
  if (!_ && (typeof require !== 'undefined')) _ = require("underscore");
  
  
  // Talk.Server
  // --------------
  
  // Server interface, talking the Talk protocol

  Talk.Server = function(type) {
    // TODO: implement
  };

  _.extend(Talk.Server.prototype, {
    // TODO: implement
  });
  
  // Talk.Client
  // --------------
  
  // Represents a typed data object within a `Data.Graph`.
  // Provides access to properties, defined on the corresponding `Data.Type`.

  Talk.Client = function(url) {
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
})();