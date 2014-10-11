module.exports = new Logger();

// Logging Levels
// 0 - Messages
// 1 - Errors
// 2 - Warnings
// 3 - Debug

function Logger() {
  this.logLevel = 3;
}

Logger.prototype.setLogLevel = function(level) {
  this.logLevel = level;
};

Logger.prototype.message = function() {
  console.log.apply(console, arguments);
};

Logger.prototype.debug = function() {
  if(this.logLevel > 2) {
    console.log.apply(console, arguments);
  }
};

Logger.prototype.warn = function() {
  if(this.logLevel > 1) {
    console.log.apply(console, arguments);
  }
};

Logger.prototype.error = function() {
  if(this.logLevel > 0) {
    console.log.apply(console, arguments);
  }
};
