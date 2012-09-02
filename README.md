# Substance Talk

Substance Talk is a protocol for exchanging data between multiple parties using the network. A party can be a web-browser, a web-server or any network program that can handle the Talk protocol. The communication is done by messages (expressed as JSON) and works in both directions. You can use any technology to implement a program that participates in a Substance Talk.

The idea is simple: Users should no longer worry about the implementation details of networking (such as HTTP headers etc.). People talk in messages and computers should too. Substance Talk is intended to be used with stateful connections, made possible by TCP sockets or websockets. It's being designed for realtime applications and distributed systems and kept as minimal as possible. Messages need to be specified in JSON notation.

## Install

For Node:

```
npm install talk
```

For the browser:

```html
<script language="javascript" src="talk.js"/>
```

## Usage


### On the server

```js
var Talk = require('talk');
var talk = new Talk.Server(3100);
```

Handling hello messages from the client

```js
talk.handle('hello', function(line, message) {
  console.log('Line '+ line.id +' says: "'+message+'"');
});
```

Setting up a handler that does some computation and sends a response.

```js
talk.handle('add', function(line, values, cb) {
  var sum = 0;
  values.forEach(function(val) { res += val; });
  cb(null, sum);
});
```

### On the client

```js
var talk = new Talk.Client("ws://localhost:3100/");
```

Say hello to the server. The first parameter is always the method, determining which handler gets called on the server. The second parameter contains the data being sent along with the message. The **payload** in networking jargon.

```js
talk.send(["hello", "I'm Tim"]);
```

Let's have our server doing some work for us by calculating the sum of some numbers. 

```js
talk.send(["add", [1, 5, 7]], function(err, sum) {
  console.log('And the result is: '+ sum);
});
```

Note, `Talk.send` takes an optional callback parameter that is executed once the response arrives from the server. This is a crucial functionality you might need in almost any application but plain websockets don't give you that.

## Maintaining State

Maintaining state has always been one of the most challening things in computer science. So if you're going to use Websockets you should be aware that you need to spend some time with modelling your state data. Let me say this is crucial if you want do design a reliable system. No framework will do that job for you. Have a look at the implementation of the [Substance Library](https://github.com/substance/library/blob/master/src/agent.js) to see how we're maintaining state (=document editing sessions).

