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


var Clients = [];

wsServer.on('connection', function(connection) {
    console.log(`Recieved a new connection.`);
    var ConnectedUsr = new Usr(uuidv4(),connection);
    Clients.push(ConnectedUsr);

    connection.on('close', () => {
      console.log("Someone Disconnected.");
      for (var i in Clients) {
        // console.log(Clients[i].UserId, ConnectedUsr.UserId)
        if (Clients[i].UserId == ConnectedUsr.UserId) {
          Clients.splice(i,1);
          console.log("Dropped Usr from Array");
        }
      }
    });

    connection.on('message', function message(data) {
        console.log('received: %s', data);
    });

    connection.send("Hello");
});




class Skystone {
  constructor(Name,Element,Top,Left,Bottom,Right,Position) {
    this.Name = Name;
    this.Element = Element;
    this.Top = Top;
    this.Left = Left;
    this.Bottom = Bottom;
    this.Right = Right;
    this.Position = Position;
  }
}

// There is 80 Skystones
// I just need a way to get a random skystone
// I know theres probably a FAR Better way to do this *cough like reading the directory but hey why would that cooperate?! cough* 
var SkystoneList = ["archer-1010","archer-2020","archer-3030","armored-1131-w","axecutioner-3333","blaster-0101","blaster-0202","blaster-0303", "bomber-2310-a","boom-0400","bot-1010","bot-1111","bot-2121","bot-2222","bot-3232","bot-3333","bowler-2202-e","brewer-3122-f","chompy-0001-e","chompy-0001","chompy-1011-e","conquertron-4444","crackler-2321-m","dragonet-1322-a","duelist-4000","duke-0040","enfuego-1000-f","enfuego-2000-f","enfuego-3101-f","fiend-2121-f","frigid-0010-w","frigid-0020-w","frigid-0121-w","gargantula-0141-u","golem-2222-e","goliath-4101-l","grenade-0321-t","jawbreaker-1210","jawbreaker-1310","jawbreaker-2320","jawbreaker-2321","jawbreaker-2322","jouster-2101","jouster-3101","jouster-3202","jouster-3212","jouster-3222","juggernaut-0133-t","lance-1001","lance-2002","lance-3003","lance-3113","mace-0011","mace-0022","mace-0033","mace-1133","mohawk-1100","mohawk-2200","mohawk-3300","mohawk-3311","mutticus-1331-w","punk-2103-m","riveter-1012","riveter-1013","riveter-2023","riveter-2123","riveter-2223","runner-2121-l","shield-0121","shield-0131","shield-0232","shield-1232","shield-2232","sniper-0004","spiderling-0100","spiderling-0200","spiderling-0300-a","trogmander-1222-m","ultron-222-t","wanderer-1212-u"]

class MessageObj {
  constructor(Cmd,PassedObj) {
    this.Cmd = Cmd;
    this.Obj = PassedObj;
  }
}