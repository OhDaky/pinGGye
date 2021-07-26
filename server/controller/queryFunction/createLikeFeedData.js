const { Feed: FeedModel, LikeFeed: LikeFeedModel } = require("../../models");
const logger = require("../../utils/logger");

module.exports = async (userId, feedId) => {
  const feed = await FeedModel.findOne({ where: { id: feedId } });

  if (!feed) {
    feed.error = "invalid";
    return feed;
  }
  if (feed.download > 10) {
    feed.error = "exceed";
    return feed;
  }

  const [likeFeed, created] = await LikeFeedModel.findOrCreate({
    where: {
      userId: userId,
      feedId: feedId,
    },
  });

  if (!created) {
    feed.error = "exist";
    return feed;
  }

  //* 해당 피드의 다운로드 횟수(알) 증가
  await feed.update({ download: feed.download + 1 });
  logger(`피드 ${feedId}번 다운로드 수 ${feed.download}회로 증가`);

  return feed;
};
