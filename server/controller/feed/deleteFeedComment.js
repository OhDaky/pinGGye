const { FeedComment: FeedCommentModel } = require("../../models");
const logger = require("../../utils/logger");
const db = require("../queryFunction");

module.exports = async (req, res) => {
  const { userId, accountType } = req.userInfo;
  const { id: feedId } = req.params;
  const { commentId } = req.body;

  if (!feedId || !commentId) {
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }

  try {
    let comment;
    if (accountType === "admin") {
      comment = await FeedCommentModel.findOne({
        where: { id: commentId, feedId: feedId },
      });
    } else {
      comment = await FeedCommentModel.findOne({
        where: { id: commentId, feedId: feedId, userId: userId },
      });
    }
    if (!comment) {
      return res.status(400).json({ message: "Invalid request" }); // 유효하지 않은 피드 번호 또는 권한 오류
    }

    await comment.destroy();
    logger(`피드 ${feedId}번 댓글 ${commentId}번 삭제 완료`);

    const comments = await db.findFeedComments(feedId);

    res
      .status(201)
      .json({ data: { comments }, message: "Comment successfully deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete comment" });
  }
};
