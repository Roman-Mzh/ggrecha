"use strict";

require("core-js/modules/es.promise");

require("core-js/modules/es.string.split");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _Agent = _interopRequireDefault(require("socks5-https-client/lib/Agent"));

var _nodeTelegramBotApi = _interopRequireDefault(require("node-telegram-bot-api"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _models = require("./models");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

_dotenv.default.config();

const botProcess = tap => {
  console.log("bot is connecting to ".concat(process.env.TG_TOKEN));
  const bot = new _nodeTelegramBotApi.default(process.env.TG_TOKEN, {
    polling: true,
    request: {
      agentClass: _Agent.default,
      agentOptions: {
        socksHost: process.env.SOCKS_HOST,
        socksPort: process.env.SOCKS_PORT,
        socksUsername: process.env.SOCKS_USER,
        socksPassword: process.env.SOCKS_PASS
      }
    }
  });
  bot.onText(/\/help/, (_ref) => {
    let {
      chat,
      chat: {
        id
      }
    } = _ref;
    bot.notifyMe("\u0418\u043D\u0442\u0435\u0440\u0435\u0441\u0443\u0435\u0442\u0441\u044F \u0431\u043E\u0442\u043E\u043C: @".concat(chat.title || chat.username));
    bot.sendMessage(id, "\n    commands:\n  <pre>/follow untappdUsername [telegramUsername]</pre> follow untappd user. If telegramUsername is specified, will tag this username on checkin!\n\n  <pre>/following</pre> display a list of following untappd users for this channel\n\n  <pre>/unfollow untappdUsername</pre> stop following user\n\n  <pre>/last untappdUsername</pre> show last checked beer of user\n    ", {
      parse_mode: 'HTML'
    });
  });
  bot.onText(/\/follow (.*)/, (_ref2, match) => {
    let {
      chat,
      chat: {
        id
      }
    } = _ref2;
    const text = match[1].split(' ');
    bot.notifyMe("\u041D\u043E\u0432\u044B\u0439 \u043F\u043E\u0434\u043F\u0438\u0441\u0447\u0438\u043A: @".concat(chat.title || chat.username, " \u043D\u0430 ").concat(text));
    follow(id, text);
  });
  bot.onText(/\/last (.*)/, (_ref3, match) => {
    let {
      chat: {
        id
      }
    } = _ref3;
    const username = match[1];
    tap.checkLast(id, username);
  });
  bot.onText(/\/following/, (_ref4) => {
    let {
      chat: {
        id
      }
    } = _ref4;

    _models.Follow.findAll({
      where: {
        chatId: id
      }
    }).then(followings => {
      const list = followings.length ? followings.map(e => "".concat(e.tapUsername, " (").concat(e.tgUsername || '-', ")")).join(', ') : 'кажется, подписок нет. возможно, нужно подписаться на zhigulevskoe?';
      bot.sendMessage(id, list);
    });
  });
  bot.onText(/\/unfollow (.*)/, (_ref5, match) => {
    let {
      chat: {
        id
      }
    } = _ref5;

    _models.Follow.destroy({
      where: {
        chatId: id,
        tapUsername: match[1]
      }
    }).then(res => {
      if (!res) {
        bot.sendMessage(id, "\u043A\u0430\u0436\u0435\u0442\u0441\u044F, \u044F \u043D\u0435 \u043F\u043E\u0434\u043F\u0438\u0441\u0430\u043D \u043D\u0430 ".concat(match[1]));
      } else {
        bot.sendMessage(id, "".concat(match[1], " \u043D\u0430\u043C \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0435 \u0438\u043D\u0442\u0435\u0440\u0435\u0441\u0435\u043D. \u0436\u0430\u043B\u044C."));
      }
    });
  });

  const follow = async (id, _ref6) => {
    let [tapUsername, tg] = _ref6;

    try {
      const url = "https://untappd.com/user/".concat(tapUsername);
      const res = await (0, _nodeFetch.default)(url);
      if (res.status === 404) throw "\u0412\u043E\u0442 \u044D\u0442\u043E \u043F\u043E\u0432\u043E\u0440\u043E\u0442! \u0412 \u0442\u0430\u043F\u043A\u0435 \u043D\u0435\u0442 \u044E\u0437\u0435\u0440\u0430 ".concat(tapUsername);
      const followObj = {
        chatId: id,
        tapUsername: tapUsername
      };
      const f = await _models.Follow.findAll({
        where: followObj
      });
      if (!!f.length) throw "\u044F \u0443\u0436\u0435 \u043F\u043E\u0434\u043F\u0438\u0441\u0430\u043D \u043D\u0430 \u043A\u043E\u043C\u0440\u0430\u0434\u0430 ".concat(tapUsername, " \u0432 \u044D\u0442\u043E\u043C \u0447\u0430\u0442\u0438");

      _models.Follow.create(_objectSpread({}, followObj, {
        tgUsername: tg
      }));

      tap.syncOne(tapUsername);
      bot.sendMessage(id, "\u043E\u0442\u043B\u0438\u0447\u043D\u043E! \u0436\u0434\u0451\u043C, \u043F\u043E\u043A\u0430 ".concat(tapUsername, " \u0437\u0430\u0447\u0435\u043A\u0438\u043D\u0438\u0442 \u043F\u0438\u0432\u043E!"));
    } catch (e) {
      bot.sendMessage(id, e);
    }
  }; // bot.sendMessage(-238934789, 'я же не яндех -.-')


  bot.on('message', msg => {// console.log(msg)
  });

  bot.notifyMe = text => {
    bot.sendMessage(173126581, text);
  };

  return bot;
};

var _default = botProcess;
exports.default = _default;