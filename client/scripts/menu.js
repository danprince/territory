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
