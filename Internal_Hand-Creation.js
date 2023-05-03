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
    this.Hand = null;
  }
}

class Enemy {
  constructor(Hand) {
    this.Hand = Hand;
    this.UserId = "ENEMY";
  }
}

class MessageObj {
  constructor(Cmd,PassedObj) {
    this.Cmd = Cmd;
    this.Obj = PassedObj;
  }
}

class PlayedWrapper {
  constructor(Plr,Stone) {
    this.Plr = Plr;
    this.Stone = Stone;
  }
}

class Skystone {
  constructor(Name,Element,Top,Right,Bottom,Left,Position) {
    this.Name = Name;
    this.Element = Element;
    this.Top = Top;
    this.Right = Right;
    this.Bottom = Bottom;
    this.Left = Left;
    this.Position = Position;
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
          // console.log("Dropped Usr from Array");
        }
      }
    });

    Handle_Game(ConnectedUsr);

    //connection.send("Hello");
});


// There is 80 Skystones
// I just need a way to get a random skystone
// I know theres probably a FAR Better way to do this *cough like reading the directory but hey why would that cooperate?! cough* 
var SkystoneList = [
  "archer-1010","archer-2020","archer-3030",
  "armored-1131-w",
  "axecutioner-3333",
  "blaster-0101","blaster-0202","blaster-0303", 
  "bomber-2310-a",
  "boom-0400",
  "bot-1010","bot-1111","bot-2121","bot-2222","bot-3232","bot-3333",
  "bowler-2202-e",
  "brewer-3122-f",
  "chompy-0001-e","chompy-0001","chompy-1011-e",
  "conquertron-4444",
  "crackler-2321-m",
  "dragonet-1322-a",
  "duelist-4000",
  "duke-0040",
  "enfuego-1000-f","enfuego-2000-f","enfuego-3101-f",
  "fiend-2121-f",
  "frigid-0010-w","frigid-0020-w","frigid-0121-w",
  "gargantula-0141-u",
  "golem-2222-e",
  "goliath-4101-l",
  "grenade-0321-t",
  "jawbreaker-1210","jawbreaker-1310","jawbreaker-2320","jawbreaker-2321","jawbreaker-2322",
  "jouster-2101","jouster-3101","jouster-3202","jouster-3212","jouster-3222",
  "juggernaut-0133-t",
  "lance-1001","lance-2002","lance-3003","lance-3113",
  "mace-0011","mace-0022","mace-0033","mace-1133",
  "mohawk-1100","mohawk-2200","mohawk-3300","mohawk-3311",
  "mutticus-1331-w",
  "punk-2103-m",
  "riveter-1012","riveter-1013","riveter-2023","riveter-2123","riveter-2223",
  "runner-2121-l",
  "shield-0121","shield-0131","shield-0232","shield-1232","shield-2232",
  "sniper-0004",
  "spiderling-0100","spiderling-0200","spiderling-0300-a",
  "trogmander-1222-m",
  "ultron-2222-t",
  "wanderer-1212-u"
];

function GrabRandomSkystone() {
  //Random Number 0-79
  //Index said number with list
  //Split retrieved item and compile to object
  var RandomisedNum = Math.floor(Math.random() * 80); //1;
  var RandomStone = SkystoneList[RandomisedNum];
  var RStoneDetails = RandomStone.split("-");

  var RandomSkystone = new Skystone(RStoneDetails[0],null,RStoneDetails[1][0],RStoneDetails[1][1],RStoneDetails[1][2],RStoneDetails[1][3],null)
  
  if (RStoneDetails[2]) {
    RandomSkystone.Element = RStoneDetails[2]
  }
  
  return RandomSkystone
}
// console.log(GrabRandomSkystone());

function Compile5Stones() {
  var i = 5;
  var TempHand = [];
  while (i > 0) {
    i -= 1;
    TempHand.push(GrabRandomSkystone());
  }
  return TempHand;
}

function Compile5Stones_Usr() {
  var i = 5;
  var TempHand = [];

  while (i > 0) {
    var TempStone = GrabRandomSkystone();
    var StoneNotDuped = true;

    for (var LastTempStone of TempHand) {
      if (LastTempStone.Name == TempStone.Name) {
        StoneNotDuped = false;
      } else if (LastTempStone.Element == TempStone.Element) {
        StoneNotDuped = false;
      }
    }

    if (StoneNotDuped) {
      TempStone.Position = `SH_${i}`;
      TempHand.push(TempStone);
      i -= 1;
    }
  }

  return TempHand;
}

function CheckForCopy(StoneA, StoneB) {
  var isCopy = false;

  if (StoneA.Name == StoneB.Name) {
    if (StoneA.Element == StoneB.Element) {
      if (StoneA.Top == StoneB.Top) {
        if (StoneA.Right == StoneB.Right) {
          if (StoneA.Bottom == StoneB.Bottom) {
            if (StoneA.Left == StoneB.Left) {
              isCopy = true;
            }
          }
        }
      }
    }
  }

  return isCopy;
}

function TakeStone(Plr,StoneA,StoneB,RealPlr) {
  if (Plr.UserId != "ENEMY") {
    if (StoneA.Plr == Plr.UserId) {
      Plr.Connection.send(JSON.stringify(new MessageObj("ChangeControlOfStone_Enemy",StoneA.Stone)));
    } else {
      Plr.Connection.send(JSON.stringify(new MessageObj("ChangeControlOfStone_User",StoneA.Stone)));
    }
  }
  if (RealPlr != null) {
    if (StoneA.Plr == RealPlr.UserId) {
      RealPlr.Connection.send(JSON.stringify(new MessageObj("ChangeControlOfStone_Enemy",StoneA.Stone)));
    } else {
      RealPlr.Connection.send(JSON.stringify(new MessageObj("ChangeControlOfStone_User",StoneA.Stone)));
    }
  }

  StoneA.Plr = StoneB.Plr;
  // console.log(`${StoneA.Stone.Position} taken by ${StoneB.Stone.Position}`);
}

function PlacedEffectLogic(Table,Plr,PlayerPlaced,RealPlr) {
  for (var PlayedStone of Table) {
    if (PlayedStone.Plr != PlayerPlaced.Plr) {
      switch (PlayerPlaced.Stone.Position) {
        case "iSGB_1":
          switch (PlayedStone.Stone.Position) {
            case "iSGB_2":
              if (PlayerPlaced.Stone.Right > PlayedStone.Stone.Left) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
              break;
            case "iSGB_4":
              if (PlayerPlaced.Stone.Bottom > PlayedStone.Stone.Top) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
              break;
          }
          break;
        case "iSGB_2":
          switch (PlayedStone.Stone.Position) {
            case "iSGB_1":
              if (PlayerPlaced.Stone.Left > PlayedStone.Stone.Right) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
              break;
            case "iSGB_3":
              if (PlayerPlaced.Stone.Right > PlayedStone.Stone.Left) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
              break;
            case "iSGB_5":
              if (PlayerPlaced.Stone.Bottom > PlayedStone.Stone.Top) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
              break;
          }
          break;
        case "iSGB_3":
          switch (PlayedStone.Stone.Position) {
            case "iSGB_2":
              if (PlayerPlaced.Stone.Left > PlayedStone.Stone.Right) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
              break;
            case "iSGB_6":
              if (PlayerPlaced.Stone.Bottom > PlayedStone.Stone.Top) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
              break;
          }
        break;
        case "iSGB_4":
          switch (PlayedStone.Stone.Position) {
            case "iSGB_1":
              if (PlayerPlaced.Stone.Top > PlayedStone.Stone.Bottom) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
              break;
            case "iSGB_5":
              if (PlayerPlaced.Stone.Right > PlayedStone.Stone.Left) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
              break;
            case "iSGB_7":
              if (PlayerPlaced.Stone.Bottom > PlayedStone.Stone.Top) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
              break;
          }
        break;
        case "iSGB_5":
          switch (PlayedStone.Stone.Position) {
            case "iSGB_2":
              if (PlayerPlaced.Stone.Top > PlayedStone.Stone.Bottom) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
              break;
            case "iSGB_6":
              if (PlayerPlaced.Stone.Right > PlayedStone.Stone.Left) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
              break;
            case "iSGB_7":
              if (PlayerPlaced.Stone.Bottom > PlayedStone.Stone.Top) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
              break;
            case "iSGB_4":
              if (PlayerPlaced.Stone.Left > PlayedStone.Stone.Right) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
              break;
          }
        break;
        case "iSGB_6":
          switch (PlayedStone.Stone.Position) {
            case "iSGB_3":
              if (PlayerPlaced.Stone.Top > PlayedStone.Stone.Bottom) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
            break;
            case "iSGB_5":
              if (PlayerPlaced.Stone.Left > PlayedStone.Stone.Right) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
            break;
            case "iSGB_9":
              if (PlayerPlaced.Stone.Bottom > PlayedStone.Stone.Top) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
            break;
          }
        break;
        case "iSGB_7":
          switch (PlayedStone.Stone.Position) {
            case "iSGB_4":
              if (PlayerPlaced.Stone.Top > PlayedStone.Stone.Bottom) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
              break;
            case "iSGB_8":
              if (PlayerPlaced.Stone.Right > PlayedStone.Stone.Left) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
              break;
          }
        break;
        case "iSGB_8":
          switch (PlayedStone.Stone.Position) {
            case "iSGB_5":
              if (PlayerPlaced.Stone.Top > PlayedStone.Stone.Bottom) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
            break;
            case "iSGB_7":
              if (PlayerPlaced.Stone.Left > PlayedStone.Stone.Right) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
            break;
            case "iSGB_9":
              if (PlayerPlaced.Stone.Right > PlayedStone.Stone.Left) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
            break;
          }
        break;
        case "iSGB_9":
          switch (PlayedStone.Stone.Position) {
            case "iSGB_6":
              if (PlayerPlaced.Stone.Top > PlayedStone.Stone.Bottom) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
            break;
            case "iSGB_8":
              if (PlayerPlaced.Stone.Left > PlayedStone.Stone.Right) {
                TakeStone(Plr,PlayedStone,PlayerPlaced,RealPlr);
              }
            break;
          }
        break;
      }
    }
  }
}

function PlacedEffectLogic2(Table,Plr,PlayerPlaced,RealPlr) {
  var StonePosInt = ConvertSGB_Int(PlayerPlaced.Position);
  for (var PlayedStone of Table) {
    if (PlayedStone.Plr != PlayerPlaced.Plr) {
     
    }
  }
}

function ConvertSGB_Int(Pos) {
  var ReturnNum = 0;
  ReturnNum = Pos.split("_")[1]
  ReturnNum = int(ReturnNum)
  return ReturnNum
}

function EnemyPlay(Ai,Table,RealPlr) {
  var LogicLevel = 1;
  // console.log(Ai);

  var CheckForCompatibleStone = function(Side,Num) {
    var ReturnedStone = null;

    for (var HandStone of Ai.Hand) {
      if (HandStone.Position == null) {
        switch (Side) {
          case "Top":
            if (HandStone.Bottom > Num) {
              ReturnedStone = HandStone;
            }
          break;
          case "Right":
            if (HandStone.Left > Num) {
              ReturnedStone = HandStone;
            }
          break;
          case "Left":
            if (HandStone.Right > Num) {
              ReturnedStone = HandStone;
            }
          break;
          case "Bottom":
            if (HandStone.Top > Num) {
              ReturnedStone = HandStone;
            }
          break;
        }
      }
    }
    if (ReturnedStone == null) {
      for (var HandStone of Ai.Hand) {
        if (HandStone.Position == null) {
          switch (Side) {
            case "Top":
              if (HandStone.Bottom >= Num) {
                ReturnedStone = HandStone;
              }
            break;
            case "Right":
              if (HandStone.Left >= Num) {
                ReturnedStone = HandStone;
              }
            break;
            case "Left":
              if (HandStone.Right >= Num) {
                ReturnedStone = HandStone;
              }
            break;
            case "Bottom":
              if (HandStone.Top >= Num) {
                ReturnedStone = HandStone;
              }
            break;
          }
        }
      }
    }
    if (ReturnedStone == null) {
      for (var HandStone of Ai.Hand) {
        if (HandStone.Position == null) {
          switch (Side) {
            case "Top":
              if (HandStone.Bottom <= Num) {
                ReturnedStone = HandStone;
              }
            break;
            case "Right":
              if (HandStone.Left <= Num) {
                ReturnedStone = HandStone;
              }
            break;
            case "Left":
              if (HandStone.Right <= Num) {
                ReturnedStone = HandStone;
              }
            break;
            case "Bottom":
              if (HandStone.Top <= Num) {
                ReturnedStone = HandStone;
              }
            break;
          }
        }
      }
    }

    return ReturnedStone;
  }

  if (LogicLevel == 1) {
    var BestMove = null;
    
    for (var PlayedStone of Table) {
      if (PlayedStone.Plr != "ENEMY") {
        var CurrentStone = PlayedStone.Stone;
        var StoneLogic = function(Num) {
          if (CurrentStone.Top == Num && CurrentStone.Position != "iSGB_1" && CurrentStone.Position != "iSGB_2" && CurrentStone.Position != "iSGB_3") {
            BestMove = CheckForCompatibleStone("Top",Num);

            if (BestMove != null) {
              switch (CurrentStone.Position) {
                case "iSGB_4":
                  BestMove.Position = "iSGB_1"
                break;
                case "iSGB_5":
                  BestMove.Position = "iSGB_2"
                break;
                case "iSGB_6":
                  BestMove.Position = "iSGB_3"
                break;
                case "iSGB_7":
                  BestMove.Position = "iSGB_4"
                break;
                case "iSGB_8":
                  BestMove.Position = "iSGB_5"
                break;
                case "iSGB_9":
                  BestMove.Position = "iSGB_6"
                break;
              }
            }
          }
          if (CurrentStone.Right == Num && CurrentStone.Position != "iSGB_3" && CurrentStone.Position != "iSGB_6" && CurrentStone.Position != "iSGB_9" && BestMove == null) {
            BestMove = CheckForCompatibleStone("Right",Num);

            if (BestMove != null) {
              switch (CurrentStone.Position) {
                case "iSGB_1":
                  BestMove.Position = "iSGB_2"
                break;
                case "iSGB_2":
                  BestMove.Position = "iSGB_3"
                break;
                case "iSGB_4":
                  BestMove.Position = "iSGB_5"
                break;
                case "iSGB_5":
                  BestMove.Position = "iSGB_6"
                break;
                case "iSGB_7":
                  BestMove.Position = "iSGB_8"
                break;
                case "iSGB_8":
                  BestMove.Position = "iSGB_9"
                break;
              }
            }
          }
          if (CurrentStone.Bottom == Num && CurrentStone.Position != "iSGB_7" && CurrentStone.Position != "iSGB_8" && CurrentStone.Position != "iSGB_9" && BestMove == null) {
            BestMove = CheckForCompatibleStone("Bottom",Num);

            if (BestMove != null) {
              switch (CurrentStone.Position) {
                case "iSGB_1":
                  BestMove.Position = "iSGB_4"
                break;
                case "iSGB_2":
                  BestMove.Position = "iSGB_5"
                break;
                case "iSGB_3":
                  BestMove.Position = "iSGB_6"
                break;
                case "iSGB_4":
                  BestMove.Position = "iSGB_7"
                break;
                case "iSGB_5":
                  BestMove.Position = "iSGB_8"
                break;
                case "iSGB_6":
                  BestMove.Position = "iSGB_9"
                break;
              }
            }
          }
          if (CurrentStone.Left == Num && CurrentStone.Position != "iSGB_1" && CurrentStone.Position != "iSGB_4" && CurrentStone.Position != "iSGB_7" && BestMove == null) {
            BestMove = CheckForCompatibleStone("Left",Num);

            if (BestMove != null) {
              switch (CurrentStone.Position) {
                case "iSGB_2":
                  BestMove.Position = "iSGB_1"
                break;
                case "iSGB_3":
                  BestMove.Position = "iSGB_2"
                break;
                case "iSGB_5":
                  BestMove.Position = "iSGB_4"
                break;
                case "iSGB_6":
                  BestMove.Position = "iSGB_5"
                break;
                case "iSGB_8":
                  BestMove.Position  = "iSGB_7"
                break;
                case "iSGB_9":
                  BestMove.Position = "iSGB_8"
                break;
              }
            }
          }
          for (var PlayedStonePos of Table) {
            if (BestMove != null) {
              if (PlayedStonePos.Stone.Position == BestMove.Position) {
                BestMove.Position = null;
                BestMove = null;
              }
            }
          }

          // for (var HandStone of Ai.Hand) {
          //   for (var SecondStone of Ai.Hand) {
          //     if (HandStone.Position == SecondStone.Position) {
          //       SecondStone.Position = null;
          //     }
          //   }
          // }
        }

        // var Num = 0;
        // while (BestMove == null) {
        //   Num += 1;
        //   if (Num = 5) {
        //     Num = 1;
        //   }
        //   StoneLogic(Num);
        // }

        if (BestMove == null) {
          StoneLogic(1);
        }
        if (BestMove == null) {
          StoneLogic(2);
        }
        if (BestMove == null) {
          StoneLogic(3);
        }
        if (BestMove == null) {
          StoneLogic(4);
        }
      }
    }

    if (BestMove == null) {
      for (var HandStone of Ai.Hand) {
        console.log(HandStone);
        if (HandStone.Position == null) {
          BestMove = HandStone;
          var Bnum = 0;
          while (BestMove.Position == null) {
            Bnum += 1;
            BestMove.Position = `iSGB_${Bnum}`;
            console.log(Bnum);
            for (var PlayedStonePos of Table) {
              if (PlayedStonePos.Stone.Position == BestMove.Position) {
                BestMove.Position = null;
              }
            }

            if (Bnum > 9) {
              break;
            }
          }
        }
      }
    }

    var WrappedBestMove = new PlayedWrapper(Ai.UserId,BestMove);
    console.log(WrappedBestMove);
    if (BestMove != null) {
      PlacedEffectLogic(Table,Ai,WrappedBestMove,RealPlr);
      Table.push(WrappedBestMove);
      RealPlr.Connection.send(JSON.stringify(new MessageObj("EnemyPlayStone",BestMove)));
    }
  }
}

function Handle_Game(Plr) {
  Plr.Hand = Compile5Stones_Usr();
  var Ai = new Enemy(Compile5Stones());
  var Table = [];
  var StonesPlaced = 0;

  for (var HandStone of Ai.Hand) {
    HandStone.Position = null;
  }

  //Set User Hand
  Plr.Connection.send(JSON.stringify(new MessageObj("SetUsrHand",Plr.Hand)));
  // Plr.Connection.send()
  Ai.Hand[1].Position = "iSGB_6";
  Plr.Connection.send(JSON.stringify(new MessageObj("EnemyPlayStone",Ai.Hand[1])));
  Table.push(new PlayedWrapper("ENEMY",Ai.Hand[1]));
  StonesPlaced += 1;

  Plr.Connection.on('message', function message(data) {
    // console.log('received: %s', data);
    var Obj = JSON.parse(data);

    if (Obj.Cmd == "PlayUsrStone") {
      for (var PlayedStone of Table) {
        if (CheckForCopy(PlayedStone,Obj.Obj)) {
          return //Playing the exact same card
        }
      }

      var PlayerPlaced = new PlayedWrapper(Plr.UserId,Obj.Obj);
      for (var PlayedStone of Table) {
        if (PlayedStone.Stone.Position == PlayerPlaced.Stone.Position) {
          return //Playing the exact same card
        }
      }

      // console.log(`Player Placed at: ${PlayerPlaced.Stone.Position}`);
      // Plr.Connection.send(JSON.stringify(new MessageObj("ChangeControlOfStone_User",PlayerPlaced.Stone)));
      StonesPlaced += 1;

      PlacedEffectLogic(Table,Plr,PlayerPlaced,null);

      Table.push(PlayerPlaced);
      EnemyPlay(Ai,Table,Plr);
      StonesPlaced += 1;

      if (StonesPlaced == 9) {

      }
    }
  });
}