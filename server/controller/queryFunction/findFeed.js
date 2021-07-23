const { Feed: FeedModel } = require("../../models");

module.exports = async (feedId) => {
  const feed = await FeedModel.findOne({ where: { id: feedId } });

  if (!feed) {
    return null;
  }
  return feed;
};
