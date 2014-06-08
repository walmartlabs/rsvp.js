import Promise from './promise';
import {
  noop,
  FULFILLED,
  REJECTED,
  reject,
  resolve,
  subscribe
} from './-internal';

function Generator(cb) {
  this.PromiseConstructor = Promise;
  this.promise = new Promise(noop);
  this.queue = [];
  this.generator = undefined;
  if (this.invoke(cb)) {
    this.iterate(this.generator.next());
  }
}

Generator.prototype.invoke = function(cb) {
  try {
    this.generator = cb();
  } catch(error) {
    reject(this.promise, error);
  }
};

Generator.prototype.generate = function(value) {
  return this.iterate(this.generator.next(value));
};

Generator.prototype.throw = function(reason) {
  try {
    this.generator.throw(reason);
  } catch(error) {
    reject(this.promise, error);
  }
};

Generator.prototype.iterate = function(iteration) {
  var that = this;
  var generator = this.generator;

  var isDone = iteration.done;
  var value  = iteration.value;

  while (!isDone && isNotObject(value)) {
    this.generator.next(value);
    iteration = this.generator.next();
    isDone = iteration.done;
    value = iteration.value;
  }

  if (isDone) {

  } else if (value.constructor === this.PromiseConstructor) {
    this.handleOwnThenable(value);
  } else {
    this.handleMaybeThenable(value);
  }
};

// slow path
Generator.prototype.handleMaybeThenable = function(maybe) {
  var generator = this.generator;
  var that = this;

  var a = Promise.resolve(maybe).then(function(value) {
    return generator.next(value).value;
  });

  subscribe(a, function(result) {
    that.generator(result);
  }, function(reason) {
    that.throw(reason);
  });
};

// fast path
Generator.prototype.handleOwnThenable = function(thenable) {
  var state = thenable._state;
  var generator = this.generator;
  var that = this;

  if (state === FULFILLED) {
    this.generate(thenable._detail);
  } else if (state === REJECTED) {
    this.throw(thenable._detail);
  } else {
    subscribe(thenable, function(value) {
      // problem
      that.generate(value);
    }, function(reason) {
      that.throw(reason);
    });
  }
};



export default function spawn(cb) {
  return new Generator(cb).promise;
}

function isObject(o) {
  return o !== null && typeof o === 'object';
}

function isNotObject(o) {
  return o === null || typeof o !== 'object';
}
