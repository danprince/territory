module.exports = Player;

function Player(socket, settings) {
  settings = settings || {};

  this.socket = socket;
  this.name = settings.name || 'Player';
  this.score = 0;
  this.turns = 0;
  this.lost = false;
}

// Update number of turns with score
Player.prototype.refresh = function() {
  this.turns = this.score;
};

// Update the players score
Player.prototype.score = function(value) {
  this.score += (value || 1);

  if(this.score <= 0) {
    this.lost = true;
  }
};

