var Player = require('./game/player');

module.exports = Room;

function Room(sockets) {
  this.players = sockets.map(function(socket, index) {
    socket.emit('message', { body: 'Joining room!' });
    socket.emit('start');
    return new Player(socket, { id: index });
  });
}

// Emit message to all players in room
Room.prototype.emit = function() {
  var args = [].slice.call(arguments);

  // send index with each message
  this.players.forEach(function(player, index) {
    player.socket.emit.apply(player.socket, args.concat([index]));
  });
};

Room.prototype.on = function(event, handler) {
  this.players.forEach(function(player, index) {
    player.socket.on(event, handler);
  });
};
