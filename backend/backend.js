const express = require('express');
const http = require('http');
const io = require('socket.io');

const endpoint = '/home/aissat/Documents/Fianarana/Codes/webAdventure/js/dijkstra/'; // to specify the root path of each request
const server_PORT = 8000;
const socket_PORT=3000;

// ---------------------app server----------------------------------
const app = express();
const server = http.createServer(app);

app.use(express.static(endpoint));// pages
app.use('/socket.io', express.static(endpoint+'node_modules/socket.io/client-dist/')); //socket

server.listen(server_PORT, () => {
    console.log(`Webserver running on port ${server_PORT}`);
});

// -----------------------socket--------------------------------------
// allowing to handle requests from a page hosted via another process on port 8000
const serverSocket = io(server, {
    cors: {
      origin: "http://localhost:" + server_PORT
      // methods: ["GET", "POST"]
    }
  });

// Define a connection event
serverSocket.on('connection', (socket) => {
  var clientHost = socket.handshake.headers.host/*.split(':')[1]*/;
  console.log('A user connected');
  console.log(clientHost);
  console.log("client id: ", socket.id);

  // Define event handlers
  socket.on('disconnect', () => {
      console.log('User disconnected');
  });
});

// Listen for incoming connections
serverSocket.listen(socket_PORT);
console.log(`Main socket server listening on port ${socket_PORT}`);
