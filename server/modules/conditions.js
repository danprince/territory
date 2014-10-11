module.exports = Conditions;

function Conditions(board) {
  this.board = board;
  this.cursor = {
    player: null,
    x: 0,
    y: 0
  };
}

// Update the condition cursor
Conditions.prototype.setCursor = function(player, x, y) {
  this.cursor.player = player;
  this.cursor.x = x;
  this.cursor.y = y;

  // cache targets for quick lookup
  this.__targetCache__ = {};
};

// Are there are any of this players cells adjacent
Conditions.prototype.neighbouring = function() {
  var ns = this.board.neighbours(this.cursor.x, this.cursor.y);
  return ns.indexOf(this.cursor.player.id) >= 0;
};

// Is this tile already open?
Conditions.prototype.open = function() {
  return this.target() === -1;
};

// Does the player already own this tile?
Conditions.prototype.own = function() {
  return this.target() === this.cursor.player.id;
};

// Is this tile already owned by an opponent?
Conditions.prototype.opponent = function() {
  return this.target() !== this.cursor.player.id;
};

// Helper method for getting the target tile
Conditions.prototype.target = function() {
  var cached = null,
      id = this.cursor.x + '' + this.cursor.y;

  if((cached = this.__targetCache__[id])) {
    return cached;
  } else {
    cached = this.board.at(this.cursor.x, this.cursor.y);
    this.__targetCache__[id] = cached;
    return cached;
  }
};

// Static check for any neighbours, requires
// passing of player (not cursor)
Conditions.prototype.stuck = function(player) {
  var tiles, tile;

  tiles = this.board.all(player.id);

  // check whether any tiles don't have neighbours
  for(var i = 0; i < tiles.length; i++) {
    tile = tiles[i];
    if(this.board.neighbours(tile.x, tile.y).indexOf(-1) >= 0) {
      // has an empty neighbour
      return false;
    }
  }

  return true;
};
