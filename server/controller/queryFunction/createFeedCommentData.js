const { FeedComment: FeedCommentModel } = require("../../models");
const logger = require("../../utils/logger");

module.exports = async (feedId, userId, textContent) => {
  //* DB에 피드 댓글 입력
  const comment = await FeedCommentModel.create({
    feedId: feedId,
    userId: userId,
    textContent: textContent,
  });
  logger(`피드 ${feedId}번 댓글 ${comment.id}번 입력 완료`);

  return comment;
};
