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
