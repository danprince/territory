var socket = require('../socket'),
  RoomButtons = require('./roomButtons'),
  WaitingPlayers = require('./waitingPlayers');

var components = {};
module.exports = components;

components.roomButtons = new RoomButtons();
roomButtons.addButton(2, function() {

});
