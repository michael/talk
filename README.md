# Talk

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
  route: "document:update",
  id: "document-id",
  data: {
    ...
  }
}
```