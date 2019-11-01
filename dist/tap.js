"use strict";

require("core-js/modules/es.promise");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _jsdom = _interopRequireDefault(require("jsdom"));

var _bot = _interopRequireDefault(require("./bot"));

var _models = require("./models");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Tap {
  constructor() {
    this.start();
  }

  start() {
    this.worker = setInterval(() => {
      this.syncAll();
      this.notifyAll();
    }, 120000);
    return this.worker;
  }

  stop() {
    if (this.isOnline) clearInterval(this.worker);
  }

  isOnline() {
    return !!this.worker;
  }

  async syncAll() {
    _models.Follow.findAll().then(follows => {
      const parses = new Set(follows.map(e => e.tapUsername));
      parses.forEach(user => {
        this.syncOne(user);
      });
    });
  }

  async checkLast(id, username) {
    const checkins = await _models.Checkin.findAll({
      where: {
        tapUsername: username
      },
      order: [['date', 'desc']],
      limit: 1
    });

    if (checkins.length) {
      const checkin = checkins[0];

      _bot.default.sendMessage(id, checkin.last());
    } else {
      _bot.default.sendMessage(id, "\u0423 ".concat(username, " \u043D\u0435\u0442 \u0447\u0435\u043A\u0438\u043D\u043E\u0432, \u0438\u043B\u0438 \u043D\u0430 \u043D\u0435\u0433\u043E \u043D\u0438\u043A\u0442\u043E \u043D\u0435 \u043F\u043E\u0434\u043F\u0438\u0441\u0430\u043D :("));
    }
  }

  async syncOne(username) {
    const beers = await parseBeers(username);
    beers.forEach(beer => {
      _models.Checkin.findOrCreate({
        where: {
          checkin_id: beer[0]
        },
        defaults: beer[1]
      });
    });
  }

  async notifyAll() {
    const checkins = await _models.Checkin.findAll({
      where: {
        isSent: false
      }
    });
    checkins.forEach(checkin => {
      this.notifyOne(checkin);
    });
  }

  async notifyOne(checkin) {
    const follows = await _models.Follow.findAll({
      where: {
        tapUsername: checkin.tapUsername
      }
    });
    if (!follows.length) return;
    const chats = follows.map(f => f.chatId);
    const tgUsername = follows[0].tgUsername;
    checkin.update({
      isSent: true
    });
    chats.forEach(id => {
      _bot.default.sendMessage(id, checkin.text(tgUsername)).then(() => {
        _bot.default.sendMessage(id, "https://untappd.com/user/".concat(checkin.tapUsername, "/checkin/").concat(checkin.checkin_id));
      });
    });
  }

}

async function recentBeers(url) {
  const page = await (0, _nodeFetch.default)(url);
  const html = await page.text();
  const doc = new _jsdom.default.JSDOM(html);
  const {
    window: {
      document
    }
  } = doc;
  return document.getElementById('main-stream');
}

async function parseBeers(username) {
  const doc = await recentBeers("https://untappd.com/user/".concat(username));
  const items = doc.querySelectorAll('.item');
  return Array.from(items).map(item => {
    const {
      dataset: {
        checkinId
      }
    } = item;
    const text = item.querySelector('.text');
    const rating = ((item.querySelector('[data-rating]') || {}).dataset || {}).rating;
    const date = item.querySelector('a[data-href=":feed/viewcheckindate"]');
    const checkinData = {
      tapUsername: username,
      fullName: text.querySelector('a:nth-child(1)').innerHTML,
      beerName: text.querySelector('a:nth-child(2)').innerHTML,
      brewery: text.querySelector('a:nth-child(3)').innerHTML,
      place: (text.querySelector('a:nth-child(4)') || {}).innerHTML,
      date: (0, _moment.default)(date.innerHTML).format(),
      score: parseFloat(rating) * 100
    };
    return [checkinId, checkinData];
  });
}

var _default = Tap;
exports.default = _default;