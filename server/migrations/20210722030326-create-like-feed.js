'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LikeFeeds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "Users", key: "id" },
      },
      feedId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "Feeds", key: "id" },
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
    await queryInterface.dropTable('LikeFeeds');
  }
};