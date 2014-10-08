// Main Application File
var _ = require('./util'),
    components = require('./components'),
    socket = require('./socket');

socket.on('connect', function() {
  // default size, take this out later
});


socket.on('waiting', function(count) {
  console.log(count, 'players waiting');
  // change in
  waitingPlayers.update(count);
});

// initialize the game
socket.on('init', function(settings) {
  // me - color/number
  // board size
  // players
});

// update the meta states
socket.on('state', function(state) {
  // score
  // turns
});

// change the state of one tile
socket.on('tile', function(x, y, value) {
  // change element through board
});

// game message to show
socket.on('message', function(message) {
  console.log(message);
  // display message tooltip
});

// player chat
socket.on('chat', function(message) {
  // add message to component
});

window.addEventListener('load', init);

function init() {


  roomButtons.render(_.byId('room-buttons'));


}
