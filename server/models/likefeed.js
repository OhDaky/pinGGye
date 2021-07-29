'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LikeFeed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LikeFeed.belongsTo(models.User);
      LikeFeed.belongsTo(models.Feed);
    }
  };
  LikeFeed.init({
    userId: DataTypes.INTEGER,
    feedId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LikeFeed',
  });
  return LikeFeed;
};