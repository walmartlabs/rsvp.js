/* jshint node:true, undef:true, unused:true */
var compileModules = require('broccoli-compile-modules');
var mergeTrees = require('broccoli-merge-trees');

var browserDist = compileModules('lib', {
  inputFiles: ['es6-promise.umd.js'],
  output: '/es6-promise.js',
  formatter: 'bundle'
});

module.exports = mergeTrees([
  browserDist
]);
