// https://www.darkspyro.net/giants/skystones/
// Holy Grail of sky stones websites

//Used to actually run the client of the webpage

const { fs } = require('fs');
var Socket = new WebSocket("ws://127.0.0.1:9752/")

Socket.onmessage = ({data}) => {
    console.log(data);
    Socket.send("Hi");
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
    constructor(Name,Element,Top,Left,Bottom,Right,Position) {
      this.Name = Name;
      this.Element = Element;
      this.Top = Top;
      this.Left = Left;
      this.Bottom = Bottom;
      this.Right = Right;
      this.Position = Position
    }
}

var Selected_SkyStone = null;

function select_skystone_hand(elem) {
    if (hasClass(elem, "skystone_hand_selected")) {return};

    console.log(elem);
    console.log(elem.src.split("/"));

    var StoneSource_Split = elem.src.split("/");
    var StoneSource_Name = StoneSource_Split[StoneSource_Split.length - 1];
    var StoneSource_Details = StoneSource_Name.split(".")[0].split("-");
    // console.log(StoneSource_Name, StoneSource_Details[2][0]);

    Selected_SkyStone = new Skystone(StoneSource_Details[1],null,StoneSource_Details[2][0],StoneSource_Details[2][1],StoneSource_Details[2][2],StoneSource_Details[2][3],"Hand");

    var menu = document.getElementsByTagName('img');
    for (var i = 0; menu[i]; i++) {
        if (hasClass(menu[i], "skystone_hand_selected")) {
            removeClass(menu[i], "skystone_hand_selected");
        };
    };

    addClass(elem, "skystone_hand_selected");
}

function construct_image_src(SkystoneObj) {
    var SrcStr = `skystone-${SkystoneObj.Name}-${SkystoneObj.Top}${SkystoneObj.Left}${SkystoneObj.Bottom}${SkystoneObj.Right}.png`;
    return SrcStr;
}