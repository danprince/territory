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
      socket.on('tile:update', function(x, y, value) {
        $scope.set(x, y, value);
      });

      socket.on('game:init', function() {
        $scope.render();
      });
    }
  };
});
