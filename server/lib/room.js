var Player = require('./player');

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

// Attach an event handler to all players
Room.prototype.on = function(event, handler) {
  this.players.forEach(function(player, index) {
    player.socket.on(event, handler.bind(player));
  });
};

Room.prototype.all = function(handler) {
  this.players.forEach(handler);
};

// Create JSON ready representation
Room.prototype.toJSON = function() {
  return this.players.map(function(player) {
    return player.toJSON();
  });
};
