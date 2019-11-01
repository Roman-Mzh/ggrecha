'use strict'
const env = process.env.NODE_ENV || 'development';

var ggrecha;

if (env === 'development') {
  ggrecha = require('./src/index').default();
} else {
  ggrecha = require('./dist/index').default);
}

console.log(ggrecha)