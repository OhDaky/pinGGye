const { Feed: FeedModel, Tag: TagModel } = require("../../models");
const { Op } = require("sequelize");

module.exports = async (limit, order) => {
  //* 입력값 핸들링
  if (limit && !isNaN(Number(limit))) limit = Number(limit);
  else limit = null;

  if (typeof order === "string") order = order.toUpperCase();
  if (order !== "ASC" && order !== "DESC") order = "ASC";

  //* 태그-피드 조인 쿼리
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

  //* 각 태그 요소와 연결된 피드 갯수 입력
  const formattedTags = tags.map((tag) => {
    const feedCount = tag.dataValues.Feeds.length;
    tag.dataValues.feedCount = feedCount;
    delete tag.dataValues.Feeds;
    return tag.dataValues;
  });
  // .filter((tag) => tag.feedCount > 0);

  return formattedTags;
};
