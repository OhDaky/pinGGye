const { Feed: FeedModel, LikeFeed: LikeFeedModel } = require("../../../models");
const logger = require("../../../utils/logger");

module.exports = async (userId, feedId) => {
  let feed = await FeedModel.findOne({ where: { id: feedId } });

  if (!feed) {
    feed = {};
    feed.error = "invalid";
    logger(`유저 ${userId}: 유효하지 않은 피드 ${feedId}번의 이미지 다운로드 요청`);
    return feed;
  }
  if (userId === feed.userId) {
    feed.error = "mine";
    logger(`유저 ${userId}: 본인이 작성한 피드 ${feedId}번의 이미지 다운로드 요청`);
    return feed;
  }

  if (feed.download > 10) {
    feed.error = "exceed";
    logger(`유저 ${userId}: 다운로드 회수가 초과된 피드 ${feedId}번의 이미지 다운로드 요청`);
    return feed;
  }

  const [likeFeed, created] = await LikeFeedModel.findOrCreate({
    where: {
      userId: userId,
      feedId: feedId,
    },
  });

  if (!created) {
    logger(`유저 ${userId}: 본인이 이미 다운받은 피드 ${feedId}번의 이미지 다운로드 요청`);
    feed.error = "exist";
    return feed;
  }

  //* 해당 피드의 다운로드 횟수(알) 증가
  await feed.update({ download: feed.download + 1 });
  logger(`유저 ${userId}: 피드 ${feedId}번 다운로드 수 ${feed.download}회로 증가`);

  return feed;
};
