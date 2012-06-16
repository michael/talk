# Talk

Before we get into detail. Let's recap what Websocket can do for us.

* Stateful connections
* Exchanging Messages in both directions

This sounds wonderful, but what does it mean for application development? Websockets are a low level interface for exchanging data. It's still a young technology, waiting to be adopted on a broader scale. Lot's of tools exist for building HTTP Servers (Express.js) and Clients (jQuery et.al) but for realtime apps you are more or less on your own. For good reason, since realtime applications are hard to design generically, and require the most possible flexibilty for data exchange to deal with edge cases and for keeping the message size small.


What's challening:

## Maintaining State
Maintaining state has always been one of the most challening things in computer science. So if you're going to use Websockets you should be aware that you need to spend some time with modelling your state data. Let me say this is crucial if you want do design a reliable system.


Examples:

Chat with multiple channels:

The server needs to keep track about who is active in which channel


What's the point of Talk.js

* A JSON-based protocol for exchanging messages.
* Talking data.
* No longer worry about headers, POST vs. GET just send and receive data (as JSON)
* A replacement for HTTP client/server communication. Send JSON, receive JSON. That's it.

## State

Depending on what a client has done so far, the server needs to keep a state object for each client, as well as a global state

## Routing

In our case each document:create or document:open command modifies the state of a client. In other words the client gets assigned a document, and one that is done. Messages are exchanged between all clients that also have that document open. However, the client doesn't know anything about that. he just sends and receives messages, based on how your application-specific protocol looks like.


Forget everything about URLS's and headers, now you have stateful connections to your server. However building a stateful application is not super easy but doable. So instead of providing you a full fledged framework, we are just defining a generic JSON exchange protocol as well as some hook-in points you can use to build your application. All you need to know is there's messages (expressed as JSON) that are sent back and forth.

## REST

GET /documents/4

## Talk

{
  route: "document/get",
  id: "document-id"
}

## REST

POST /documents/4

## Talk

```
{
  command: "document:update",
  id: "document-id",
  data: {
    ...
  }
}
```


# Communication by example


Client1 -> Server: Create an empty document

```js
{
  command: "document:create",
  id: "hello-world"
}
```

Server -> Client1: Done. You

```js
{
  status: "success"
}
```

Client2 -> Server: Open document `hello-world`

```js
{
  command: "document:get",
  id: "hello-world"
}
```

Server -> Client2: Done. There's two active users, including you.

```js
{
  status: "success"
  document: {...},
  active-users: ["client1", "client2"]
}
```

Client1 -> Server: Create new task


```js
{
  command: "node:create",
  type: "/type/task",
  data: {
    name: "A new task"
  }
}
```

Server -> Client 1: Confirmed.


Server -> Client 2:

```js
{
  command: "node:create",
  type: "/type/task",
  data: {
    name: "A new task"
  }
}
```
