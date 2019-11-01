"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tap = _interopRequireDefault(require("./tap"));

var _bot = _interopRequireDefault(require("./bot"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = () => {
  const tap = new _tap.default();
  const bot = (0, _bot.default)(tap);
  tap.start(bot);
  return {
    tap,
    bot
  };
};

var _default = app;
exports.default = _default;