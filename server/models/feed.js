'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Feed.belongsTo(models.User)
      Feed.belongsToMany(models.Tag, { through: "Feeds_Tags", timestamps: false });
      Feed.hasMany(models.FeedComment);
      Feed.hasMany(models.LikeFeed);
    }
  };
  Feed.init({
    userId: DataTypes.INTEGER,
    subject: DataTypes.STRING,
    image: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    download: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Feed',
  });
  return Feed;
};