var fs = require('fs');

module.exports = new Logger();

// Logging Levels
// 0 - Messages
// 1 - Errors
// 2 - Warnings
// 3 - Debug

function Logger() {
  this.logLevel = 3;
}

Logger.prototype.log = function() {
  var args = [].slice.call(arguments);
  console.log.apply(console, arguments);
  fs.appendFile('server.log', args.join(' '));
};

Logger.prototype.setLogLevel = function(level) {
  this.logLevel = level;
};

Logger.prototype.message = function() {
  this.log.apply(console, arguments);
};

Logger.prototype.debug = function() {
  if(this.logLevel > 2) {
    this.log.apply(console, arguments);
  }
};

Logger.prototype.warn = function() {
  if(this.logLevel > 1) {
    this.log.apply(console, arguments);
  }
};

Logger.prototype.error = function() {
  if(this.logLevel > 0) {
    this.log.apply(console, arguments);
  }
};
