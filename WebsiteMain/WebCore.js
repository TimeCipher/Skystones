// https://www.darkspyro.net/giants/skystones/
// Holy Grail of sky stones websites

//Used to actually run the client of the webpage

var Socket = new WebSocket("ws://127.0.0.1:9752/")

Socket.onmessage = ({data}) => {
    console.log(data);
    Socket.send("Hi");
};

function select_skystone_hand(elem) {
    console.log(elem)
}