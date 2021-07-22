const {
  Feed: FeedModel,
  Tag: TagModel,
  User: UserModel,
} = require("../../models");

const readAllFeeds = async (req, res) => {
  try {
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
    const result = feeds.map((feed) => {
      feed.dataValues.Tags = feed.dataValues.Tags.map((tag) => tag.name);
      feed.dataValues.nickname = feed.dataValues.User.nickname;
      feed.dataValues.User = feed.dataValues.User.email;
      return feed.dataValues;
    });
    console.log("모든 피드 조회");
    res
      .status(200)
      .json({ data: { feeds: result }, message: "Send all feeds" });
  } catch (error) {
    return res.status(500).json({ data: null, message: "Server error" });
  }
};

module.exports = readAllFeeds;
