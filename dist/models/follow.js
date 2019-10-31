'use strict';

module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    chatId: DataTypes.INTEGER,
    tapUsername: DataTypes.STRING,
    tgUsername: DataTypes.STRING
  }, {
    indexes: [{
      unique: true,
      fields: ['chatId', 'tapUsername']
    }]
  });

  Follow.associate = function (models) {// associations can be defined here
  };

  return Follow;
};