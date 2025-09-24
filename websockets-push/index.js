const http = require("http");
const WebSocketServer = require("websocket").server;
let connections = [];

//create a raw http server (this will help us create the TCP which will then pass to the websocket to do the job)
const httpServer = http.createServer();

//pass the httpserver object to the WebSocketServer library to do all the job, this class will override the req/res
const websocket = new WebSocketServer({ httpServer: httpServer });

httpServer.listen(8001, () => {
  console.log("Server is listening on port 8001");
});

// when a legit websocket request comes in, this event will be called
websocket.on("request", (request) => {
  const connection = request.accept(null, request.origin);
  connection.on("message", (message) => {
    connections.forEach((con) => {
      con.send(
        `User ${connection.socket.remotePort} says: ${message.utf8Data}`
      );
    });
  });

  connections.push(connection);

  connections.forEach((con) => {
    con.send(`User ${connection.socket.remotePort} joined the chat`);
  });
});
