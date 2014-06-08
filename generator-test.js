var RSVP = require('./dist/commonjs/main');
var Promise = RSVP.Promise;

var counter = 0;
function timer(delay) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve('timer: ' + counter++);
    }, delay);
  });
}

function throwLater(error, delay) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(error);
    }, delay);
  });
}

RSVP.spawn(function* numbers() {
  console.log(1);
  var a = yield timer(500);
  console.log(2);
  var b = yield timer(500);
  console.log(3);
  var d = yield 'I AM D';
  console.log(4);

  try {
    var c = yield throwLater(new Error(), 500);
  } catch(error) {
    console.log('caught', error);
  }

  console.log('bro', a, b, d);

  return 5;
}).then(function(omg) {
  console.log('all done', omg);
}).catch(function(reason) {
  console.log('didCatch', reason);
});

