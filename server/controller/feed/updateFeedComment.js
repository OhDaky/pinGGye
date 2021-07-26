const { FeedComment: FeedCommentModel } = require("../../models");
const logger = require("../../utils/logger");
const db = require("../queryFunction");

module.exports = async (req, res) => {
  const { userId } = req.userInfo;
  const { id: feedId } = req.params;
  const { commentId, textContent } = req.body;
  if (!feedId || !commentId || !textContent) {
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }

  try {
    const comment = await FeedCommentModel.findOne({
      where: { id: commentId, feedId: feedId, userId: userId },
    });
    if (!comment) {
      return res.status(400).json({ message: "Invalid request" }); // 올바르지 않은 요청값 또는 권한 없음
    }

    await comment.update({ textContent: textContent });
    logger(`피드 댓글 수정 - 피드 ${feedId}번 댓글 ${commentId} 번 갱신 완료`);

    const comments = await db.findFeedComments(feedId);

    res
      .status(201)
      .json({ data: { comments }, message: "Comment successfully updated" });
  } catch {
    console.error(error);
    res.status(500).json({ message: "Failed to update comment" });
  }
};
