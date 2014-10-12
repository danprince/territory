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
