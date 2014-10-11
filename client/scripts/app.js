require('./util');
require('./socket');
require('./chat');
require('./game');
require('./board');

angular.module('territory', ['util', 'socket', 'chat', 'game', 'board']);
