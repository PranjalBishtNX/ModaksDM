//var mongojs = require("mongojs");
var db = null;//mongojs('localhost:27017/myGame', ['account','progress']);

var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(process.env.PORT || 2000);
console.log("Server started.");


var io = require('socket.io')(serv,{});


var players = {};
io.on('connection', function(socket) {
  socket.on('new player', function() {
    players[socket.id] = {
      x: 300,
      y: 300
    };
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  });
});
setInterval(function() {
  io.sockets.emit('state', players);
}, 100 / 60);

app.get('/login', function (req, res) {
  //login controllers go here
  //trust me it will make sense in a few days
  //it already makes sense nigga ~nitrox
});

app.get('/lobby', function (req, res) {
  //lobby controllers may check session before the reponse header is sent
  res.sendFile(__dirname + '/views/lobby.html');
});

app.get('/decks', function (req, res) {
  res.sendFile(__dirname + '/views/decks.html');
});

app.get('/stats', function (req, res) {
  res.sendFile(__dirname + '/views/stats.html');
});

app.get('/duel', function (req, res) {
  res.sendFile(__dirname + '/views/duel.html');
});

app.use('/views', express.static(__dirname + '/views'));
