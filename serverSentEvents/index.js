const app = require("express")();

// CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Cache-Control"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  next();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");

  // Send initial connection message
  res.write("data: Connected to SSE stream\n\n");
  send(res);

  req.on("close", () => {
    console.log("Client disconnected from SSE stream");
  });
});

const port = 4001;

let i = 0;

function send(res) {
  res.write("data:" + `hello from the server --- [${i++}]` + "\n\n");
  setTimeout(() => send(res), 1000);
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// client side ussage

/* Client Code 

let sse = new EventSource("http://localhost:8080/stream");
sse.onmessage = console.log

*/
