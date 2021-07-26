const {
  Feed: FeedModel,
  User: UserModel,
  Tag: TagModel,
  LikeFeed: LikeFeedModel,
} = require("../../models");
const { Op } = require("sequelize");

module.exports = async (userId, start, end, limit, order) => {
  if (start && !isNaN(Number(start))) start = Number(start);
  else start = 1;

  if (end && !isNaN(Number(end))) end = Number(end);
  else end = Number.MAX_SAFE_INTEGER;

  if (limit && !isNaN(Number(limit))) limit = Number(limit);
  else limit = null;

  if (typeof order === "string") order = order.toUpperCase();

  if (order !== "ASC" && order !== "DESC") order = "ASC";

  let feeds;

  feeds = await FeedModel.findAll({
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
      {
        model: LikeFeedModel,
        where: {
          userId: userId,
        },
      },
    ],
    where: {
      id: {
        [Op.gte]: start,
        [Op.lte]: end,
      },
    },
    limit: limit,
    order: [["id", order]],
  });

  // 피드 포맷 변경
  const formattedFeeds = feeds.map((feed) => {
    feed.dataValues.tags = feed.dataValues.Tags.map((tag) => tag.name);
    feed.dataValues.nickname = feed.dataValues.User.nickname;
    feed.dataValues.email = feed.dataValues.User.email;
    feed.dataValues.downloadAt = feed.dataValues.LikeFeeds[0].createdAt;
    delete feed.dataValues.Tags;
    delete feed.dataValues.User;
    delete feed.dataValues.LikeFeeds;
    return feed.dataValues;
  });

  return formattedFeeds;
};
