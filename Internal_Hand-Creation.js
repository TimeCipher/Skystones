//This will generate the hand keycode to later be verified by the server
//User will send cards, and a unique code will be created for that hand
//Another part of the server will then be able to verify and decode said hand

// Card - Type - Top - Left - Bottom - Right
// lance - nil - 01 -01 - 00 - 00


const { WebSocketServer } = require('ws');
const http = require('http');
const { v4: uuidv4 } = require('uuid');

// Spinning the http server and the WebSocket server.
const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 9752;
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});

// I'm maintaining all active connections in this object
const clients = {};

// A new client connection request received
wsServer.on('connection', function(connection) {
    // Generate a unique code for every user
    const userId = uuidv4();
    console.log(`Recieved a new connection.`);

    // Store the new connection and handle messages
    clients[userId] = connection;
    console.log(`${userId} connected.`);

    function handleDisconnect(userId) {
        console.log(`${userId} disconnected.`);
        delete clients[userId];
    }
    // User disconnected
    connection.on('close', () => handleDisconnect(userId));

    connection.on('message', function message(data) {
        console.log('received: %s', data);
    });

    connection.send("Hello")
});

function broadcastMessage(json) {
    // We are sending the current data to all connected active clients
    const data = JSON.stringify(json);
    for(let userId in clients) {
      let client = clients[userId];
      if(client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    };
}

