const { FeedComment: FeedCommentModel } = require("../../models");
const logger = require("../../utils/logger");
const db = require("../queryFunction");

module.exports = async (req, res) => {
  const { userId } = req.userInfo;
  const { id: feedId } = req.params;
  const { commentId, textContent } = req.body;
  if (!feedId || !commentId || !textContent) {
    logger(
      `[ERROR] 피드 댓글 수정 - 유저 ${userId}: 요청 파라미터 부족. feedId: ${feedId} commentId: ${commentId} textContent:${textContent}`
    );
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }

  try {
    const comment = await FeedCommentModel.findOne({
      where: { id: commentId, feedId: feedId, userId: userId },
    });
    if (!comment) {
      logger(
        `[ERROR] 피드 댓글 수정 - 유저 ${userId}: 유효하지 않거나 수정 권한이 없는 피드 ${feedId} 댓글 ${commentId} 삭제 요청`
      );
      return res.status(400).json({ message: "Invalid request" }); // 올바르지 않은 요청값 또는 권한 없음
    }

    await comment.update({ textContent: textContent });
    logger(
      `피드 댓글 수정 - 유저 ${userId}: 피드 ${feedId}번 댓글 ${commentId} 번 수정 완료`
    );

    const comments = await db.findFeedComments(feedId);
    logger(`피드 댓글 수정 - 유저 ${userId}: 피드 ${feedId} 댓글 조회`);

    res
      .status(201)
      .json({ data: { comments }, message: "Comment successfully updated" });
  } catch {
    logger(
      `[ERROR] 피드 댓글 수정 - 유저 ${userId}: 서버 에러. 피드 ${feedId} 댓글 ${commentId} 수정 요청 실패`
    );
    console.error(error);
    res.status(500).json({ message: "Failed to update comment" });
  }
};
