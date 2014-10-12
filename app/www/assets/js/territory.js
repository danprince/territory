(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./util');
require('./socket');
require('./chat');
require('./game');
require('./board');
require('./menu');

angular.module('territory', ['ui.router', 'util', 'socket', 'chat', 'game', 'board', 'menu'])

.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider

  .state('menu', {
    url: '/',
    templateUrl: 'views/menu.html'
  })
  .state('menu.rules', {
    url: 'rules',
    templateUrl: 'views/rules.html'
  })
  .state('menu.about', {
    url: 'about',
    templateUrl: 'views/about.html'
  })
  .state('menu.error', {
    url: 'error',
    templateUrl: 'views/error.html'
  })
  .state('play', {
    url: '/play',
    templateUrl: 'views/play.html'
  });

});

},{"./board":2,"./chat":3,"./game":4,"./menu":5,"./socket":6,"./util":7}],2:[function(require,module,exports){
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
        var tile = _.div('square tile pill');

        tile.addEventListener('click', function() {
          socket.emit('player:act', x, y);
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

        element.innerHTML = '';
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

      // force a re-render
      $scope.$watch('width', function() {
        $scope.render();
      });

      socket.on('tile:update', function(x, y, value) {
        $scope.set(x, y, value);
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
        socket.emit('player:chat', $scope.message);
        $scope.message = '';
      };

      // player messages
      socket.on('game:chat', function(message) {
        $scope.messages.push(message);
      });

      // system messages
      socket.on('game:message', function(message) {
        $scope.messages.push(message);
      });
    },
    template:
    "<div class='sub window'>" +
      "<div class='message' ng-repeat='message in messages'" +
        "ng-class='{my:message.id === id}'>" +
        "<div class='bubble'>" +
          "<header>" +
            "<div class='square pill player-{{message.id}}'></div>" +
            "<span class='time' ng-bind='message.time | pretty'></span>" +
          "</header>" +
          "<p class='body' ng-bind='message.body'></p>" +
        "</div>" +
      "</div>" +
      "<form class='input' ng-submit='send()'>" +
        "<input type='text' ng-model='message' placeholder='Chat...'/>" +
      "</form>" +
    "</div>"
  };
});

},{}],4:[function(require,module,exports){
angular.module('game', ['socket'])

.controller('GameController', function($scope, $state, socket) {
  $scope.players = [];
  $scope.started = false;
  $scope.over = true; // cheap redirect
  $scope.dimensions = { x: 0, y: 0 };
  $scope.turn = 0;
  $scope.ticks = 0;
  $scope.status = 'Game Started';

  socket.on('game:init', function(settings, id) {
    $scope.over = false;
    $state.go('play');
    $scope.started = true;
    $scope.players = settings.players;
    $scope.dimensions = settings.dimensions;
    $scope.id = id;
  });

  socket.on('game:status', function(status) {
    $scope.status = status;
  });

  socket.on('game:turn', function(turn, ticks) {
    $scope.turn = turn;
    $scope.ticks = ticks;
    $scope.$apply();
  });

  socket.on('player:update', function(player) {
    $scope.players[player.id] = player;
  });

  socket.on('game:over', function(winner) {
    $scope.over = true;
    $scope.winner = winner;
  });
})

.directive('waitingPlayers', function() {
  return {
    restrict: 'A',
    controller: function($scope, socket) {
      $scope.waiting = 0;

      socket.on('waiting', function(waiting) {
        $scope.waiting = waiting;
      });

      socket.emit('waiting');
    },
    template: "<span ng-bind='waiting'></span>"
  };
});

},{}],5:[function(require,module,exports){
angular.module('menu', ['socket'])

.controller('MenuController', function($scope, socket) {
  $scope.playing = false;
  $scope.chosenSize = false;

  $scope.play = function() {
    $scope.playing = true;
  };

  $scope.reset = function() {
    $scope.playing = false;
    $scope.chosenSize = false;
  };

  $scope.choose = function(size) {
    $scope.chosenSize = true;
    socket.emit('size', size);
  };

});

},{}],6:[function(require,module,exports){
angular.module('socket', ['btford.socket-io'])

.factory('socket', function(socketFactory) {
  var socket = socketFactory({
    ioSocket: io('http://localhost:3000')
  });

  function error() {
    window.location.replace('#/error');
  }

  socket.on('error', error);
  socket.on('reconnect_error', error);
  socket.on('connect_error', error);
  socket.on('disconnect', error);

  return socket;
});

},{}],7:[function(require,module,exports){
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
})

.filter('sortBy', function() {
  return function(array, key) {
    // Use slice to stop modifying the array
    // in place
    return array.slice().sort(function(a, b) {
      return a[key] - b[key];
    });
  };
});

},{}]},{},[1]);
