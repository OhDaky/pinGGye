'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FeedComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FeedComment.belongsTo(models.User);
      FeedComment.belongsTo(models.Feed);
    }
  };
  FeedComment.init({
    feedId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    textContent: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'FeedComment',
  });
  return FeedComment;
};