module.exports = Player;

function Player(socket, settings) {
  settings = settings || {};

  this.socket = socket;
  this.id = settings.id;
  this.score = 0;
  this.moves = 0;
  this.lost = false;
}

// Send the player a message
Player.prototype.message = function(type, message) {
  this.socket.emit('game:message', {
    type: type,
    message: message,
    time: Date.now()
  });
};

// Update number of turns with score
Player.prototype.refresh = function() {
  this.moves = this.score;
};

// Convert to a JSON ready object
Player.prototype.toJSON = function() {
  return {
    id: this.id,
    score: this.score,
    moves: this.moves,
    lost: this.lost
  };
};
