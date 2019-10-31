import rnd from 'unique-random-array';
import moment from 'moment';
'use strict';

module.exports = (sequelize, DataTypes, ) => {
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
    indexes: [
      {
        unique: true,
        fields: ['checkin_id']
      }
    ]
  });
  Checkin.associate = function(models) {
    // associations can be defined here
  };
  Checkin.prototype.text = function(username) {
    const prefixes = [
      'Знаете ли вы, что ',
      'Оказывется, ',
      'По информации ТАСС ',
      'Никогда такого не было, и вот опять. ',
      'И снова ',
      'А теперь о главном: ',
      '2 + 2 всё ещё 4, а '
    ];
    const place = this.place ? ` в ${this.place}` : '';
    const message = `${rnd(prefixes)()}${username || this.tapUsername} пьёт ${this.beerName} от ${this.brewery}${place}. ` +
                    `По его мнению это пиво достойно ${this.score / 100}`
    return message;
  };

  Checkin.prototype.last = function(username) {
    const place = this.place ? ` в ${this.place}` : '';
    return `Нам известно, что ${username || this.tapUsername} в последний раз пил ` +
    `${moment(this.date).format('DD.MM.YYYY')} в ${moment(this.date).format('HH:mm')} ` +
    `${this.beerName} от ${this.brewery}${place}. ` +
    `Он тогда поставил ${this.score / 100}, что вполне справедливо!`
  }
  return Checkin;
};