var EventEmitter = require('events').EventEmitter,
    Room = require('./room'),
    log = require('./log');

module.exports = Lobby;

function Lobby() {
  this.__emitter__ = new EventEmitter();
  this.waiting = [];

  this.on = this.__emitter__.on;
  this.emit = this.__emitter__.emit;
  this.message = log.message.bind(log, '[Lobby]'.cyan);

  this.rooms = [];
}

// Add a new waiting player to this lobby
Lobby.prototype.join = function(socket) {
  this.message('Player connected'.green);
  this.waiting.push(socket);
  this.updateWaiting();
  this.emit('player:join');

  // player changes room size
  socket.on('size', function(roomSize) {
    // make sure the waiting list is an array
    if(!(this.rooms[roomSize] instanceof Array)) {
      this.rooms[roomSize] = [];
    }

    // add them and try to create a room
    this.rooms[roomSize].push(socket);
    this.tryRoom(roomSize);
    this.updateWaiting();

    this.message('Player chose room', roomSize);
  }.bind(this));

  socket.on('waiting', function() {
    socket.emit('waiting', this.waiting.length);
  }.bind(this));

  // remove them if/when they disconnect
  socket.on('disconnect', function() {
    this.waiting.splice(this.waiting.indexOf(socket), 1);
    this.updateWaiting();

    this.message('A player disconnected'.red);
  }.bind(this));
};

// Updates the nubmer of waiting players
Lobby.prototype.updateWaiting = function() {
  // tell all sockets that a new player
  // has joined the lobby.
  this.waiting.forEach(function(socket) {
    socket.emit('waiting', this.waiting.length);
  }.bind(this));

  this.message(this.waiting.length, 'players waiting');
};

// Try to create a full room of this size
Lobby.prototype.tryRoom = function(number) {
  var room = null;

  // if there are enough players to make a room
  // remove them from this list and make one
  if(this.rooms[number].length >= number) {
    room = new Room(this.rooms[number].splice(0, 4));

    // remove these sockets from the waiting list
    room.players.forEach(function(socket) {
      this.waiting.splice(this.waiting.indexOf(socket), 1);
    }.bind(this));

    this.message('Creating new room for', (number + ' players').cyan);
    this.emit('room:create', room);
  }
};
