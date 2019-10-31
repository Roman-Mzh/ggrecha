'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Checkins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      checkin_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tapUsername: {
        type: Sequelize.STRING
      },
      fullName: {
        type: Sequelize.STRING
      },
      isSent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      beerName: {
        type: Sequelize.STRING
      },
      brewery: {
        type: Sequelize.STRING
      },
      place: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE
      },
      score: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Checkins');
  }
};