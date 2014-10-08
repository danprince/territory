var util = {};

module.exports = util;

util.element = function(tag, className) {
  var el = document.createElement(tag);

  if(className) {
    el.setAttribute('class', className);
  }

  return el;
};

util.div = util.element.bind(null, 'div');
util.span = util.element.bind(null, 'span');
util.a = util.element.bind(null, 'a');
util.byId = document.getElementById.bind(document);
