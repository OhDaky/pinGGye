const {
  Feed: FeedModel,
  User: UserModel,
  Tag: TagModel,
} = require("../../models");

module.exports = async () => {
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
