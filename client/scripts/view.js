module.exports = View;

function View(mapFn) {
  this.map = {};

  window.addEventListener('load', function() {
    this.map = mapFn();

    // ensure all values are elements
    for(var key in map) {
      if(!(map[key] instanceof Element)) {
        throw new TypeError('Expected all values to be elements');
      }
    }
  });
}

// Pass a state object to update multiple states
View.prototype.update = function(data) {
  var key;

  for(key in data) {
    if(this.map[key]) {
      this.map[key].innerHTML = data[key];
    }
  }
};

// Update a single state
View.prototype.set = function(key, value) {
  this.map[key].innerHTML = value;
};
