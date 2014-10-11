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

  socket.on('game:init', function(settings) {
    $scope.ready = true;
    $scope.players = settings.players;
    $scope.dimensions = settings.dimensions;
  });

  socket.on('game:turn', function(turn, ticks) {
    $scope.turn = turn;
    $scope.ticks = ticks;
  });

  socket.on('player:update', function(player) {
    $scope.players[player.id] = player;
  });

  socket.on('game:over', function(winner) {
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
