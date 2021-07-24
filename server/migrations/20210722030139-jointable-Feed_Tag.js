'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable("Feeds_Tags", {
      feedId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "Feeds", key: "id" },
      },
      tagId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: { model: "Tags", key: "id" },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Feeds_Tags");
  }
};
