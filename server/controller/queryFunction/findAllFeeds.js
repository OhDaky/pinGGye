const {
  Feed: FeedModel,
  User: UserModel,
  Tag: TagModel,
} = require("../../models");
const { Op } = require("sequelize");

module.exports = async (start, end, limit, order) => {
  
  if (start && !isNaN(Number(start))) start = Number(start);
  else start = null;

  if (end && !isNaN(Number(end))) end = Number(end);
  else end = null;

  if (limit && !isNaN(Number(limit))) limit = Number(limit);
  else limit = null;

  if (order !== "ASC" && order !== "DESC") order = "ASC";

  let feeds;

  if (start && end) {
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
  } else if (start) {
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
      ],
      where: {
        id: {
          [Op.gte]: start,
        },
      },
      limit: limit,
      order: [["id", order]],
    });
  } else if (end) {
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
      ],
      where: {
        id: {
          [Op.lte]: end,
        },
      },
      limit: limit,
      order: [["id", order]],
    });
  } else {
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
      ],
      limit: limit,
      order: [["id", order]],
    });
  }

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

  //! 클라이언트 태그 필터링 로직
  // const tags = ["회식", "졸려", "싫어"];
  // let filtered = [];
  // let unfiltered = formattedFeeds;
  // for (const tag of tags) {
  //   filtered = filtered.concat(
  //     unfiltered.filter((feed) => feed.tags.includes(tag))
  //   );
  //   unfiltered = unfiltered.filter((feed) => !feed.tags.includes(tag));
  // }
  // return filtered;
};
