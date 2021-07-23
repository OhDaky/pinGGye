const { Feed: FeedModel, Tag: TagModel } = require("../../models");

module.exports = async () => {
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
};
