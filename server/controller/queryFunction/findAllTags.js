const { Feed: FeedModel, Tag: TagModel } = require("../../models");
const { sequelize, Op } = require("sequelize");

module.exports = async (limit, order) => {
  if (limit && !isNaN(Number(limit))) limit = Number(limit);
  else limit = null;

  if (typeof order === "string") order = order.toUpperCase();
  if (order !== "ASC" && order !== "DESC") order = "ASC";

  //* COUNT 쿼리 방법
  // const tags = await TagModel.findAll({
  //   attributes: [
  //     "id",
  //     "name",
  //     [sequelize.fn("COUNT", sequelize.col("Feeds.id"))],
  //   ],
  //   include: [{ model: FeedModel, through: { attributes: [] } }],
  //   order: [["id", order]],
  //   group: ["Feeds.id"],
  //   having: sequelize.where(
  //     [sequelize.fn("COUNT", sequelize.col("Feeds.id")),
  //     ">=",
  //     1]
  //   ),
  // });

  //* 조인 후 처리
  const tags = await TagModel.findAll({
    attributes: ["id", "name"],
    include: [
      {
        model: FeedModel,
        attributes: ["id"],
        through: { attributes: [] },
        where: {
          id: {
            [Op.gte]: 1,
          },
        },
      },
    ],
    limit: limit,
    order: [["id", order]],
    includeIgnoreAttributes: true,
  });

  const formattedTags = tags
    .map((tag) => {
      const feedCount = tag.dataValues.Feeds.length;
      tag.dataValues.feedCount = feedCount;
      delete tag.dataValues.Feeds;
      return tag.dataValues;
    });
    // .filter((tag) => tag.feedCount > 0);

  return formattedTags;
};
