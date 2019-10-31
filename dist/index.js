"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tap = _interopRequireDefault(require("./tap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const tap = new _tap.default();
setInterval(() => {// tap.syncAll();
  // tap.notifyAll();
}, 120000);
var _default = tap;
exports.default = _default;