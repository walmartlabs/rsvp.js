import PromiseEnumerator from "./promise-enumerator";
import {
  PENDING,
  FULFILLED
} from "./-internal";

import {
  o_create
} from './utils';

function PromiseHash(Constructor, object, abort_on_rejection, label) {
  this._superConstructor(Constructor, object, abort_on_rejection, label);
}

export default PromiseHash;

PromiseHash.prototype = o_create(PromiseEnumerator.prototype);
PromiseHash.prototype._superConstructor = PromiseEnumerator;
PromiseHash.prototype._init = function() {
  this._result = {};
};

PromiseHash.prototype._validateInput = function(input) {
  return input && typeof input === "object";
};

PromiseHash.prototype._validationError = function() {
  return new Error("Promise.hash must be called with an object");
};

PromiseHash.prototype._enumerate = function() {
  var promise = this.promise;
  var input   = this._input;

  for (var key in input) {
    if (promise._state === PENDING && input.hasOwnProperty(key)) {
      this.length++;
      this._remaining++;
      this._eachEntry(input[key], key);
    } else {
      return;
    }
  }
};
