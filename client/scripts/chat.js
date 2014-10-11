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
