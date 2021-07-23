const {
  Feed: FeedModel,
  User: UserModel,
  Tag: TagModel,
} = require("../../models");

module.exports = async (req, res) => {
  const feeds = await FeedModel.findAll({
    attributes: [
      "id",
      "subject",
      "image",
      "thumbnail",
      "download",
      "createdAt",
      "updatedAt",
    ],
    include: [
      { model: TagModel, required: false, through: { attributes: [] } },
      { model: UserModel },
    ],
  });
  // 피드 포맷 변경
  const formattedFeeds = feeds.map((feed) => {
    feed.dataValues.tags = feed.dataValues.Tags.map((tag) => tag.name);
    feed.dataValues.nickname = feed.dataValues.User.nickname;
    feed.dataValues.email = feed.dataValues.User.email;
    delete feed.dataValues.Tags;
    delete feed.dataValues.User;
    return feed.dataValues;
  });

  return formattedFeeds;
};
