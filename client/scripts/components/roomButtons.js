var _ = require('../util'),
    Component = require('../component');

module.exports = new Component(function(methods) {
  var root = _.div();

  methods.addButton = function(size) {
    var button = _.a('huge pill room');
    root.appendChild(button);
    button.innerHTML = size;
    return button;
  };

  return root;
});
