var Board = require('./board');

module.exports = Game;

function Game(room, settings) {
  settings = settings || {};

  this.room = room;
  this.players = room.players;
  this.board = new Board(settings.size);
  this.turn = -1;
  this.ticks = 0;
}

// Advance turn to next player
Game.prototype.nextTurn = function() {

  if(this.over()) {
    // declare a winner
  }

  this.ticks += 1;
  this.turn = this.ticks % this.players.length;
};

// Player action on a tile
Game.prototype.tileAction = function(x, y) {
  var player = this.players[this.turn];

  this.board.set(x, y, this.turn);
  player.moves--;

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
      return p1.score - p2.score;
    })
    .slice(0, 1);
};
