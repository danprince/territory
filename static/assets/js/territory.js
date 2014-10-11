(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./util');
require('./socket');
require('./chat');
require('./game');
require('./board');

angular.module('territory', ['util', 'socket', 'chat', 'game', 'board']);

},{"./board":2,"./chat":3,"./game":4,"./socket":5,"./util":6}],2:[function(require,module,exports){
angular.module('board', ['socket', 'util'])

.directive('board', function(_, socket) {
  return {
    restrict: 'A',
    scope: {
      width: '=',
      height: '='
    },
    link: function(scope, element, attrs) {
      scope.tiles = [];

      // Create tile
      scope.createTile = function(x, y) {
        var tile = _.div('tile pill');

        tile.addEventListener('click', function() {
          socket.emit('click', x, y);
        });

        return tile;
      };

      // render board
      scope.render = function() {
        var board, row, tile;
        board = _.div('board');

        for(var x = 0; x < scope.width; x++) {
          row = _.div('row');
          scope.tiles[x] = [];

          for(var y = 0; y < scope.height; y++) {
            tile = scope.createTile(x, y);
            scope.tiles[x][y] = tile;
            row.appendChild(tile);
          }
          board.appendChild(row);
        }

        element.append(board);
      };

      // get the value at this position
      scope.at = function(x, y) {
        return scope.tiles[x][y].getAttribute('player');
      };

      // set the value at x, y
      scope.set = function(x, y, value) {
        scope.tiles[x][y].setAttribute('player', value);
      };
    },
    controller: function($scope, socket) {
      socket.on('tile', function(x, y, value) {
        $scope.set(x, y, value);
      });

      socket.on('init', function() {
        $scope.render();
      });
    }
  };
});

},{}],3:[function(require,module,exports){
angular.module('chat', ['socket'])

.directive('chat', function() {
  return {
    restrict: 'A',
    controller: function($scope, socket) {
      $scope.messages = [];
      $scope.message = '';

      // send chat message
      $scope.send = function() {
        socket.emit('chat', $scope.message);
        $scope.message = '';
      };

      // player messages
      socket.on('chat', function(message) {
        $scope.messages.push(message);
      });

      // system messages
      socket.on('message', function(message) {
        $scope.messages.push(message);
      });
    },
    template:
    "<div class='chat'>" +
      "<div class='sub window'>" +
        "<div class='message {{message.type}}'" +
          "ng-repeat='message in messages'>" +
          "<span class='tiny pill contrast'" +
            "player='{{message.id}}'" +
            "ng-show='{{message.id > -1}}'>" +
            "@" +
          "</span> " +
          "<span class='hint' ng-show='message.time'" +
            "ng-bind='message.time | pretty'></span> " +
          "<span ng-bind='message.body'></span>" +
        "</div>" +
      "</div>" +
      "<form ng-submit='send()'>" +
        "<input type='text' ng-model='message'/>" +
      "</form>" +
    "</div>"
  };
});

},{}],4:[function(require,module,exports){
angular.module('game', ['socket'])

.controller('GameController', function($scope, socket) {
  $scope.players = [];
  $scope.ready = false;
  $scope.over = false;
  $scope.winner = -1;
  $scope.dimensions = { x: 5, y: 5 };
  $scope.turn = -1;
  $scope.ticks = 0;
  $scope.moves = 0;

  socket.on('init', function(settings) {
    $scope.ready = true;
    $scope.players = settings.players;
    $scope.dimensions = settings.dimensions;
  });

  socket.on('turn', function(turn, ticks) {
    $scope.turn = turn;
    $scope.ticks = ticks;
  });

  socket.on('score', function(player, score) {
    $scope.players[player].score = score;
  });

  socket.on('moves', function(moves) {
    $scope.moves = moves;
  });

  socket.on('over', function(winner) {
    $scope.over = true;
    $scope.winner = winner;
  });
})

.directive('chooseNickname', function() {
  return {
    restrict: 'A',
    controller: function($scope, socket) {
      $scope.name = '';

      $scope.set = function() {
        socket.emit('name', $scope.name);
      };
    },
    template: "<input type='text' ng-model='name' ng-change='set()'/>"
  };
})

.directive('roomChoices', function() {
  return {
    restrict: 'A',
    controller: function($scope, socket) {
      console.log('room choices');
      // limit to 2, 3 or 4 players
      $scope.choices = [2, 3, 4];

      $scope.choose = function(choice) {
        socket.emit('size', choice);
      };
    },
    template:
    "<a class='huge room pill'" +
      "ng-repeat='size in choices'" +
      "ng-click='choose(size)'" +
      "ng-bind='size'>" +
    "</a>"
  };
})

.directive('waitingPlayers', function() {
  return {
    restrict: 'A',
    controller: function($scope, socket) {
      $scope.waiting = 0;

      socket.on('waiting', function(waiting) {
        $scope.waiting = waiting;
      });
    },
    template: "<span ng-bind='waiting'></span>"
  };
});

},{}],5:[function(require,module,exports){
angular.module('socket', ['btford.socket-io'])

.factory('socket', function(socketFactory) {
  return socketFactory({
    ioSocket: io('http://localhost:3000')
  });
});

},{}],6:[function(require,module,exports){
angular.module('util', [])

.service('_', function() {
  this.element = function(tag, className) {
    var el = document.createElement(tag);

    if(className) {
      el.setAttribute('class', className);
    }

    return el;
  };

  this.div = this.element.bind(null, 'div');
  this.span = this.element.bind(null, 'span');
  this.a = this.element.bind(null, 'a');
})

.filter('pretty', function() {
  return function(time) {
    var date = new Date(time);

    return ('0' + date.getHours()).slice(-2) + ':' +
            ('0' + date.getMinutes()).slice(-2);
  };
});

},{}]},{},[1]);
