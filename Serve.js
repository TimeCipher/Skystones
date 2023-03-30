// var http = require('http');

// http.createServer(function (req, res) {
// 	res.write('Hello World!');
//     // console.log(req);
//     res.end();
// }).listen(8080);


// var http = require('http');
// var fs = require('fs');
// // var index = fs.readFileSync('Core.html');

// http.createServer(function (req, res) {
//   //res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end(fs.readFileSync('Core.html'));
// }).listen(9751);

const express = require('express');
let app = express();
app.use(express.static("./WebsiteMain"))

app.get('/', function(req, res){
    res.sendFile('Core.html', {root: __dirname + "\\WebsiteMain"});
    // console.log({root: __dirname + "\\WebsiteMain"})
});

app.listen(9751)