'use strict'
const env = process.env.NODE_ENV || 'development';
const appLog = require('debug')('app');

var ggrecha;

if (env === 'development') {
  ggrecha = require('./src/index').default(appLog);
} else {
  ggrecha = require('./dist/index').default(appLog);
}