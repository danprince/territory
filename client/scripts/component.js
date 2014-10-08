module.exports = new Component();

var components = {};

function Component() {

}

function load(name) {

}

function create(name, definition) {
  return function() {
    var element, methods;
    methods = {};

    this.element = definition(methods);

    // transfer methods to this object
    for(var key in methods) {
      this[key] = methods[key];
    }

    this.render = function(container) {
      container.appendChild(this.element);
    };
  };
}
