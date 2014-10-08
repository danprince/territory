var Player = require('./game/player');

module.exports = Room;

function Room(sockets) {
  this.players = sockets.map(function(socket) {
    socket.emit('message', 'Joining room!');
    return new Player(socket);
  });
}

// Emit message to all players in room
Room.prototype.emit = function() {
  var args = arguments;

  this.players.forEach(function(player) {
    player.socket.emit.apply(player, args);
  });
};
