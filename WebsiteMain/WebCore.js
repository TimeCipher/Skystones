// https://www.darkspyro.net/giants/skystones/
// Holy Grail of sky stones websites

//Used to actually run the client of the webpage

class MessageObj {
    constructor(Cmd,PassedObj) {
      this.Cmd = Cmd;
      this.Obj = PassedObj;
    }
}

var Socket = new WebSocket("ws://127.0.0.1:9752/")

Socket.onmessage = ({data}) => {
    console.log(data);

    var Obj = JSON.parse(data)
    if (Obj.Cmd = "SetUsrHand") {
        for (Stone of Obj.Obj) {
            document.getElementById(Stone.Position).src = construct_image_src(Stone);
        }
    }
};


// Class Editing Functions
function hasClass(el, className)
{
    if (el.classList)
        return el.classList.contains(className);
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}

function addClass(el, className)
{
    if (el.classList)
        el.classList.add(className)
    else if (!hasClass(el, className))
        el.className += " " + className;
}

function removeClass(el, className)
{
    if (el.classList)
        el.classList.remove(className)
    else if (hasClass(el, className))
    {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        el.className = el.className.replace(reg, ' ');
    }
}
// ------------------------------------

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

var Selected_SkyStone = null;
var Selected_SkyStone_Elem = null;
var Skystones_Hand = {}

function select_skystone_hand(elem) {
    if (hasClass(elem, "skystone_hand_selected")) {return};
    if (hasClass(elem, "skystone_hand_used")) {return};

    console.log(elem);
    console.log(elem.src.split("/"));

    var StoneSource_Split = elem.src.split("/");
    var StoneSource_Name = StoneSource_Split[StoneSource_Split.length - 1];
    var StoneSource_Details = StoneSource_Name.split(".")[0].split("-");
    // console.log(StoneSource_Name, StoneSource_Details[2][0]);

    Selected_SkyStone = new Skystone(StoneSource_Details[1],null,StoneSource_Details[2][0],StoneSource_Details[2][1],StoneSource_Details[2][2],StoneSource_Details[2][3],elem.id);

    if (StoneSource_Details[3]) {
        Selected_SkyStone.Element = StoneSource_Details[3]
    }

    var menu = document.getElementsByTagName('img');
    for (var i = 0; menu[i]; i++) {
        if (hasClass(menu[i], "skystone_hand_selected")) {
            removeClass(menu[i], "skystone_hand_selected");
        };
    };

    Selected_SkyStone_Elem = elem;
    addClass(elem, "skystone_hand_selected");
}

function construct_image_src(SkystoneObj) {
    var SrcStr = `skystone-${SkystoneObj.Name}-${SkystoneObj.Top}${SkystoneObj.Right}${SkystoneObj.Bottom}${SkystoneObj.Left}`;
    if (SkystoneObj.Element != null) {
        SrcStr = `${SrcStr}-${SkystoneObj.Element}`
    }
    SrcStr = "./Skystones/"+SrcStr+".png"
    return SrcStr;
}

function select_skystone_grid(elem) {
    if (Selected_SkyStone != null) {
        if (hasClass(elem, "skystone_unused")) {
            elem.src = construct_image_src(Selected_SkyStone);
            removeClass(elem, "skystone_unused");
            addClass(elem, "skystone");

            removeClass(Selected_SkyStone_Elem,"skystone_hand_selected");
            removeClass(Selected_SkyStone_Elem,"skystone_hand");
            addClass(Selected_SkyStone_Elem,"skystone_hand_used");

            Selected_SkyStone.Position = elem.id;
            Socket.send(JSON.stringify(new MessageObj("PlayUsrStone", Selected_SkyStone)));

            Selected_SkyStone = null;
            Selected_SkyStone_Elem = null;
        }
    }
}