import Promise from './es6-promise/promise';

if (typeof define === 'function' && define.amd) {
  define(function() { return Promise; });
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = Promise;
} else {
  this['Promise'] = Promise;
}
