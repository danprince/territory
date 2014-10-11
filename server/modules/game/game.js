var Board = require('./board');

module.exports = Game;

function Game(room, settings) {
  settings = settings || {};

  this.room = room;
  this.players = room.players;
  this.board = new Board(settings.size);
  this.turn = -1;
  this.ticks = 0;

  this.start();
}

// Start the game
Game.prototype.start = function() {

  this.room.emit('init', {
    dimensions: this.board.dimensions,
    players: this.players.map(function(player) { return player.toJSON(); })
  });

  // listen for chat messages
  this.room.players.forEach(function(player, index) {

    player.socket.on('chat', function(message) {
      this.room.emit('chat', {
        id: index,
        body: message,
        time: Date.now()
      });
    }.bind(this));

    player.socket.on('click', function(x, y) {
      if(player.id === this.turn) {
        this.tileAction(x, y);
      } else {
        player.socket.emit('message', { body: 'Not your turn' });
      }
    }.bind(this));

  }.bind(this));

  this.nextTurn();
};

// Advance turn to next player
Game.prototype.nextTurn = function() {
  this.ticks += 1;
  this.turn = this.ticks % this.players.length;

  this.room.emit('turn', this.turn, this.ticks);

  var player = this.players[this.turn];
  player.refresh();
  this.room.emit('moves', player.moves);
  this.room.emit('score', player.id, player.score);

  if(this.stuck(player)) {
    this.nextTurn();
  }
};

Game.prototype.placeTile = function(x, y) {
  var player = this.players[this.turn];

  player.score += 1;
  this.board.set(x, y, this.turn);
  this.room.emit('score', player.id, player.score);
  this.room.emit('tile', x, y, player.id);
  this.room.emit('moves', player.moves);

  if(this.over()) {
    // declare a winner
    this.room.emit('over', this.leader());
  }

  if(this.stuck(player)) {
    this.nextTurn();
  }
};

// Player action on a tile
Game.prototype.tileAction = function(x, y) {
  var player = this.players[this.turn];

  // Check that the user can play here
  if(this.board.neighbours(x, y).indexOf(this.turn) >= 0 ||
      // Edge case for the first turn when players have no tiles
      this.ticks <= this.players.length) {

    var target = this.board.at(x, y);
    if(target < 0) {
      player.moves -= 1;
      this.placeTile(x, y);
    } else {
      // if enemy territory
      if(target !== this.turn && player.moves >= 3 && target >= 0) {
        this.players[target].score -= 1;
        player.moves -= 3;
        this.room.emit('score', target, this.players[target].score);
        this.placeTile(x, y);
      // if not enough moves
      } else if(player.moves < 3) {
        player.socket.emit('message', { body: 'You need 3 turns to occupy' });
      // if own tile
      } else if(target === this.turn) {
        player.socket.emit('message', { body: 'You already own this tile.' });
      // if empty tile
      }
    }
  } else {
    player.socket.emit('message', { body: 'Invalid location' });
  }

  if(player.moves <= 0) {
    this.nextTurn();
  }
};

// Check whether the game is over
Game.prototype.over = function() {
  return this.board.full();
};

// Which player is in the lead
Game.prototype.leader = function() {
  return this.players
    .sort(function(p1, p2) {
      return p2.score - p1.score;
    })[0];
};

Game.prototype.stuck = function(player) {
  return this.board.all(player.id)
    .map(function(c) {
      return this.board.neighbours(c.x, c.y).indexOf(-1) < 0;
    }.bind(this))
    .indexOf(true) >= 0;
};
