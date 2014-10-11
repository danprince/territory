angular.module('util', [])

.service('_', function() {
  this.element = function(tag, className) {
    var el = document.createElement(tag);

    if(className) {
      el.setAttribute('class', className);
    }

    return el;
  };

  this.div = this.element.bind(null, 'div');
  this.span = this.element.bind(null, 'span');
  this.a = this.element.bind(null, 'a');
})

.filter('pretty', function() {
  return function(time) {
    var date = new Date(time);

    return ('0' + date.getHours()).slice(-2) + ':' +
            ('0' + date.getMinutes()).slice(-2);
  };
});
