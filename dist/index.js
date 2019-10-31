"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appLog = exports.tap = void 0;

var _tap = _interopRequireDefault(require("./tap"));

var _debug = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const tap = new _tap.default();
exports.tap = tap;
const appLog = (0, _debug.default)('app');
exports.appLog = appLog;
appLog('lets start!');
setInterval(() => {
  appLog('lets sync!');
  tap.syncAll();
  appLog('lets notify!');
  tap.notifyAll();
}, 120000);