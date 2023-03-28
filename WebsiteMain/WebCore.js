// https://www.darkspyro.net/giants/skystones/
// Holy Grail of sky stones websites

//Used to actually run the client of the webpage

var Socket = new WebSocket("ws://127.0.0.1:9752/")

Socket.onmessage = ({data}) => {
    console.log(data);
    Socket.send("Hi");
};

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

var Selected_SkyStone = null;

function select_skystone_hand(elem) {
    if (hasClass(elem, "skystone_hand_selected")) {return}

    console.log(elem);

    var menu = document.getElementsByTagName('div');
    for (var i = 0; menu[i]; i++) {
        if (hasClass(elem, "skystone_hand_selected")) {
            removeClass(elem, "skystone_hand_selected");
        };
    };
};

