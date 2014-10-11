var _ = require('./util');

module.exports = Board;

function Board(size) {
  var row = null,
      tile = null;

  this.tiles = [];
  this.board = _.div('board');
  this.size = size;

  // create 2d array of tiles
  for(var x = 0; x < size; x++) {
    tiles[x] = [];
    row = _.div('row');

    for(var y = 0; y < size; y++) {
      tile = this.createTile();
      this.tiles[x][y] = tile;
      row.appendChild(tile);
    }

    this.board.appendChild(row);
  }
}

// Create a tile for the board
Board.prototype.createTile = function() {
  var element = _.div('tile');
  element.setAttribute('player', '-1');
  return element;
};

// Update value at x, y
Board.prototype.updateTile = function(x, y, value) {
  if(x >= 0 && y >= 0 && x < this.size && y < this.size) {
    tiles[x][y].setAttribute('player', value);
  }
};

// Render an instance of the board
// into a container
Board.prototype.render = function(element) {
  if(!(element instanceof Element)) {
    throw new TypeError('Board.render expects an element');
  }

  element.appendChild(this.board);
};
