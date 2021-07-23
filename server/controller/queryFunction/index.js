const {
  Feed: FeedModel,
  User: UserModel,
  Tag: TagModel,
} = require("../../models");

module.exports = {
  findAllFeeds: async () => {
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
      feed.dataValues.Tags = feed.dataValues.Tags.map((tag) => tag.name);
      feed.dataValues.nickname = feed.dataValues.User.nickname;
      feed.dataValues.User = feed.dataValues.User.email;
      return feed.dataValues;
    });

    return formattedFeeds;
  },
  findAllTags: async () => {
    //* COUNT 쿼리 방법
    // const tags = await TagModel.findAll({
    //   attributes: ["id", "name", sequelize.fn("COUNT", sequelize.col("Feeds.id"))],
    //   include: [
    //     { model: FeedModel, attributes: [], through: { attributes: [] } }
    //   ],
    //   group: "Feeds.id",
    //   having: sequelize.where(sequelize.fn("COUNT", sequelize.col("Feeds.id")), '>=', 1)
    // });

    //* 조인 후 처리
    const tags = await TagModel.findAll({
      attributes: ["id", "name"],
      include: [
        { model: FeedModel, attributes: ["id"], through: { attributes: [] } },
      ],
    });

    const formattedTags = tags
      .map((tag) => {
        const feedCount = tag.dataValues.Feeds.length;
        tag.dataValues.feedCount = feedCount;
        delete tag.dataValues.Feeds;
        return tag.dataValues;
      })
      .filter((tag) => tag.feedCount > 0);

    return formattedTags;
  },
};
