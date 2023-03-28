// Card - Type - Top - Left - Bottom - Right
// lance - nil - 01 -01 - 00 - 00

const { WebSocketServer } = require('ws');
const http = require('http');
const { v4: uuidv4 } = require('uuid');


const server = http.createServer();
const wsServer = new WebSocketServer({ server });
server.listen(9752, () => {
  console.log(`WebSocket Server Running`);
});

class Usr {
  constructor(UserId, Connection) {
    this.UserId = UserId;
    this.Connection = Connection;
  }
}


const Clients = {};

wsServer.on('connection', function(connection) {
    console.log(`Recieved a new connection.`);
    var ConnectedUsr = new Usr(uuidv4(),connection)

    connection.on('close', () => function() {
      console.log("Someone Disconnected.");
      for (let i in Clients) {
        if (Clients[i].UserId == ConnectedUsr.UserId) {

        }
      }
    });

    connection.on('message', function message(data) {
        console.log('received: %s', data);
    });

    connection.send("Hello");
});




class Skystone {
  constructor(Name,Element,Top,Left,Bottom,Right) {
    this.Name = Name;
    this.Element = Element;
    this.Top = Top;
    this.Left = Left;
    this.Bottom = Bottom;
    this.Right = Right;
  }
}