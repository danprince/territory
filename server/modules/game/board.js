module.exports = Board;

function Board(rows, cols) {
  rows = rows || 5;
  cols = cols || rows;

  this.dimensions = {
    x: rows,
    y: cols
  };

  this.rows = [];

  for(var x = 0; x < this.dimensions.x; x++) {
    this.rows[x] = [];
    for(var y = 0; y < this.dimensions.y; y++) {
      this.rows[x][y] = -1;
    }
  }
}

// Set the value of the tile at x, y
Board.prototype.set = function(x, y, value) {
  this.rows[x][y] = value;
};

// Get the value of the tile at x, y
Board.prototype.at = function(x, y) {
  return this.rows[x][y];
};

// Check whether a certain coordinate is
// within the board
Board.prototype.isWithin = function(x, y) {
  return (x >= 0 && x < this.dimensions.x) &&
         (y >= 0 && y < this.dimensions.y);
};

// Return an array of the values of all
// neighbours surrounding a tile
Board.prototype.neighbours = function(x, y) {
  var dummy, row, above, below;

  dummy = [];
  above = this.rows[x - 1] || dummy;
  row = this.rows[x] || dummy;
  below = this.rows[x + 1] || dummy;

  return [
    above[y - 1],
    above[y],
    above[y + 1],
    row[y - 1],
    // ignore x, y
    row[y + 1],
    below[y - 1],
    below[y],
    below[y + 1]
  ].filter(function(neighbour) {
    return !isNaN(neighbour);
  });
};

// Returns an array of coordinates of
// all the tiles of a certain value
Board.prototype.all = function(value) {
  var tiles = [];

  for(var x = 0; x < this.dimensions.x; x++) {
    for(var y = 0; y < this.dimensions.y; y++) {
      if(this.rows[x][y] === value) {
        tiles.push({
          x: x,
          y: y
        });
      }
    }
  }

  return tiles;
};

// Check whether the board is full
Board.prototype.full = function() {
  return this.all(-1).length <= 0;
};
