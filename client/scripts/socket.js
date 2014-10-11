angular.module('socket', ['btford.socket-io'])

.factory('socket', function(socketFactory) {
  return socketFactory({
    ioSocket: io('http://localhost:3000')
  });
});
