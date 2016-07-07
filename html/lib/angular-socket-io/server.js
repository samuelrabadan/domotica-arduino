// server.js
var app = require("express")();  
var server = require("http").createServer(app);  
var five = require("johnny-five");  
var io=require("socket.io")(server);
 
var port = 3000; 
 
 
app.get('/', function(req, res) {  
        res.sendFile(__dirname + '/index.html');
});
 
server.listen(port);  
console.log('Server available at http://172.26.0.101:' + port);  
var led;
 
//Arduino board connection
 
var board = new five.Board();  
board.on("ready", function() {  
    console.log('Arduino connected');
    led = new five.Led(2);
});
 
//Socket connection handler
io.on('connection', function (socket) {  
        console.log(socket.id);
 
        socket.on('led:on', function (data) {
           led.on();
           console.log('LED ON RECEIVED');
        });
 
        socket.on('led:off', function (data) {
            led.off();
            console.log('LED OFF RECEIVED');
 
        });
    });
 
console.log('Waiting for connection');