"use strict";

var _uniqueRandomArray = _interopRequireDefault(require("unique-random-array"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

module.exports = (sequelize, DataTypes) => {
  const Checkin = sequelize.define('Checkin', {
    fullName: DataTypes.STRING,
    tapUsername: DataTypes.STRING,
    beerName: DataTypes.STRING,
    brewery: DataTypes.STRING,
    place: DataTypes.STRING,
    date: DataTypes.DATE,
    score: DataTypes.INTEGER,
    isSent: DataTypes.BOOLEAN,
    checkin_id: DataTypes.INTEGER
  }, {
    indexes: [{
      unique: true,
      fields: ['checkin_id']
    }]
  });

  Checkin.associate = function (models) {// associations can be defined here
  };

  Checkin.prototype.text = function (username) {
    const prefixes = ['Знаете ли вы, что ', 'Оказывется, ', 'По информации ТАСС ', 'Никогда такого не было, и вот опять. ', 'И снова ', 'А теперь о главном: ', '2 + 2 всё ещё 4, а '];
    const place = this.place ? " \u0432 ".concat(this.place) : '';
    const message = "".concat((0, _uniqueRandomArray.default)(prefixes)()).concat(username || this.tapUsername, " \u043F\u044C\u0451\u0442 ").concat(this.beerName, " \u043E\u0442 ").concat(this.brewery).concat(place, ". ") + "\u041F\u043E \u0435\u0433\u043E \u043C\u043D\u0435\u043D\u0438\u044E \u044D\u0442\u043E \u043F\u0438\u0432\u043E \u0434\u043E\u0441\u0442\u043E\u0439\u043D\u043E ".concat(this.score / 100);
    return message;
  };

  Checkin.prototype.last = function (username) {
    const place = this.place ? " \u0432 ".concat(this.place) : '';
    return "\u041D\u0430\u043C \u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E, \u0447\u0442\u043E ".concat(username || this.tapUsername, " \u0432 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u0440\u0430\u0437 \u043F\u0438\u043B ") + "".concat((0, _moment.default)(this.date).format('DD.MM.YYYY'), " \u0432 ").concat((0, _moment.default)(this.date).format('HH:mm'), " ") + "".concat(this.beerName, " \u043E\u0442 ").concat(this.brewery).concat(place, ". ") + "\u041E\u043D \u0442\u043E\u0433\u0434\u0430 \u043F\u043E\u0441\u0442\u0430\u0432\u0438\u043B ".concat(this.score / 100, ", \u0447\u0442\u043E \u0432\u043F\u043E\u043B\u043D\u0435 \u0441\u043F\u0440\u0430\u0432\u0435\u0434\u043B\u0438\u0432\u043E!");
  };

  return Checkin;
};