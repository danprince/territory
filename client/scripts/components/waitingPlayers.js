var _ = require('../util'),
    Component = require('../component');

module.exports = new Component(function(methods) {
  var root = _.span();

  methods.update = function(players) {
    root.innerHTML = size;
  };

  return root;
});
