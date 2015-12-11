// nastly hack to prevent to delay email sending
// dev mode email is simply printing it to the console
// so we are going to use that to delay

var Fiber = Npm.require('fibers');
var origWrite = process.stdout.write;
process.stdout.write = function() {
  if(Fiber.current) {
    Meteor._sleepForMs(1000);
  }
  return origWrite.apply(process.stdout, arguments);
};