'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FeedComments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      feedId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "Feeds", key: "id" },
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "Users", key: "id" },
      },
      textContent: {
        allowNull: false,
        type: Sequelize.STRING
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FeedComments');
  }
};