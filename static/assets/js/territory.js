(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./components":3,"./socket":6,"./util":7}],2:[function(require,module,exports){
module.exports = new Component();

var components = {};

function Component() {

}

function load(name) {

}

function create(name, definition) {
  return function() {
    var element, methods;
    methods = {};

    this.element = definition(methods);

    // transfer methods to this object
    for(var key in methods) {
      this[key] = methods[key];
    }

    this.render = function(container) {
      container.appendChild(this.element);
    };
  };
}

},{}],3:[function(require,module,exports){
var socket = require('../socket'),
  RoomButtons = require('./roomButtons'),
  WaitingPlayers = require('./waitingPlayers');

var components = {};
module.exports = components;

components.roomButtons = new RoomButtons();
roomButtons.addButton(2, function() {

});

},{"../socket":6,"./roomButtons":4,"./waitingPlayers":5}],4:[function(require,module,exports){
var _ = require('../util'),
    Component = require('../component');

module.exports = new Component(function(methods) {
  var root = _.div();

  methods.addButton = function(size) {
    var button = _.a('huge pill room');
    root.appendChild(button);
    button.innerHTML = size;
    return button;
  };

  return root;
});

},{"../component":2,"../util":7}],5:[function(require,module,exports){
var _ = require('../util'),
    Component = require('../component');

module.exports = new Component(function(methods) {
  var root = _.span();

  methods.update = function(players) {
    root.innerHTML = size;
  };

  return root;
});

},{"../component":2,"../util":7}],6:[function(require,module,exports){
module.exports  = io('http://localhost:3000');

},{}],7:[function(require,module,exports){
var util = {};

module.exports = util;

util.element = function(tag, className) {
  var el = document.createElement(tag);

  if(className) {
    el.setAttribute('class', className);
  }

  return el;
};

util.div = util.element.bind(null, 'div');
util.span = util.element.bind(null, 'span');
util.a = util.element.bind(null, 'a');
util.byId = document.getElementById.bind(document);

},{}]},{},[1]);
