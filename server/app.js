var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    colors = require('colors');

var Lobby = require('./modules/lobby'),
    Room = require('./modules/room'),
    Game = require('./modules/game'),
    log = require('./modules/log');

var lobby = new Lobby();

// new connections, forward to lobby
io.on('connection', function(socket){
  lobby.join(socket);
});

// when the lobby creates a room
lobby.on('room:create', function(room) {
  var game = new Game(room, {
    size: 3 + room.players.length
  });
});

http.listen(3000, function() {
  log.debug('Server listening on port', '3000'.cyan);
});
