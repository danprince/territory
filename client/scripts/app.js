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
