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
