var settings = require('../settings'),
    Board = require('./board'),
    Conditions = require('./conditions');

module.exports = Game;

function Game(room, settings) {
  settings = settings || {};

  this.board = new Board(settings.size);
  this.room = room;
  this.players = room.players;
  this.turn = -1;
  this.ticks = 0;
  this.conditions = new Conditions(this.board);

  this.start();
}

// Begin the game
Game.prototype.start = function() {
  // let players know we started
  this.room.emit('game:init', {
    dimensions: this.board.dimensions,
    players: this.room.toJSON(),
    turn: this.turn
  });

  // attach event handlers to players
  this.room.all(function(player) {
    player.socket.on('player:act', this.act.bind(this, player));
    player.socket.on('player:chat', this.chat.bind(this, player));
  }.bind(this));
};

// Advance to the next player
Game.prototype.nextTurn = function() {
  this.ticks += 1;
  this.turn = this.ticks % this.players.length;
  this.player = this.players[this.turn];
  this.player.refresh();

  // if they have lost, skip them
  if(this.player.lost) {
    this.nextTurn();
    return;
  }

  // if they are stuck, skip them
  if(this.player.moves < 3 && this.conditions.stuck(this.player)) {
    if(this.players.length > 2) {
      this.nextTurn();
      return;
    } else {
      console.log('Player stuck', this.conditions.stuck(this.player));
      this.over();
      return;
    }
  }

  // let all players know
  this.room.emit('game:turn', this.turn);
  this.room.emit('player:update', this.player);
};

// Change the value of a tile
Game.prototype.setTile = function(player, x, y) {
  player.moves -= 1;
  player.score += 1;
  this.board.set(x, y, player.id);

  this.room.emit('player:update', player);
  this.room.emit('tile:update', player.id, x, y);

  // game over?
  if(this.board.full()) {
    console.log('Board full');
    this.over();
  }

  // end of turn?
  if(player.moves <= 0) {
    this.nextTurn();
  }
};

// Action on a tile from a player
Game.prototype.act = function(player, x, y) {

  if(player.id !== this.turn) {
    player.message('warning', settings.messages.NOT_YOUR_TURN);
  }

  var target = this.players[this.board.at(x, y)];
  this.conditions.setCursor(player, x, y);

  if(!this.conditions.neighbouring() && this.ticks > this.players.length) {
    // invalid location
    player.message('warning', settings.messages.INVALID_LOCATION);
  } else {

    if(this.conditions.open()) {
      // valid open location
      this.setTile(player, x, y);
    }

    else if(this.conditions.opponent()) {
      if(player.moves >= 3) {
        // incur penalty
        player.moves -= 3;
      } else {
        // need 3 to occupy
        player.message('warning', settings.messages.NOT_ENOUGH_TURNS);
      }
    }

    else if(this.conditions.own()) {
      // you already own this tile
      player.socket.emit('game:message', settings.messages.ALREADY_OWN);
    }
  }
};

// Finish game
Game.prototype.over = function() {
  this.room.emit('game:over');
};

// Message all other players
Game.prototype.chat = function(player, message) {
  this.room.emit('game:chat', {
    time: Date.now(),
    body: message
  });
};
