const { FeedComment: FeedCommentModel } = require("../../models");
const logger = require("../../utils/logger");
const db = require("../queryFunction");

module.exports = async (req, res) => {
  const { userId, accountType } = req.userInfo;
  const { id: feedId } = req.params;
  const { commentId } = req.body;

  if (!feedId || !commentId) {
    logger(
      `[ERROR] 피드 댓글 삭제 - 유저 ${userId}: 요청 파라미터 부족. feedId: ${feedId} commentId: ${commentId}`
    );
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }

  try {
    let comment;
    if (accountType === "admin") {
      logger(
        `피드 댓글 삭제 - 유저 ${userId}: 피드 ${feedId}번 댓글 ${commentId}번 관리자 권한 삭제 요청`
      );
      comment = await FeedCommentModel.findOne({
        where: { id: commentId, feedId: feedId },
      });
    } else {
      logger(
        `피드 댓글 삭제 - 유저 ${userId}: 피드 ${feedId}번 댓글 ${commentId}번 삭제 요청`
      );
      comment = await FeedCommentModel.findOne({
        where: { id: commentId, feedId: feedId, userId: userId },
      });
    }

    if (!comment) {
      logger(
        `[ERROR] 피드 삭제 - 유저 ${userId}: 유효하지 않거나 삭제 권한이 없는 피드 ${feedId}번 댓글 ${commentId}번 삭제 요청`
      );
      return res.status(400).json({ message: "Invalid request" }); // 유효하지 않은 피드 번호 또는 권한 오류
    }

    await comment.destroy();
    logger(
      `피드 댓글 삭제 - 유저 ${userId}: 피드 ${feedId}번 댓글 ${commentId}번 삭제 완료`
    );

    const comments = await db.findFeedComments(feedId);
    logger(`피드 댓글 삭제 - 유저 ${userId}: 피드 ${feedId}번 댓글 조회`);

    res
      .status(201)
      .json({ data: { comments }, message: "Comment successfully deleted" });
  } catch (error) {
    logger(
      `[ERROR] 피드 삭제 - 유저 ${userId}: 서버 에러.  피드 ${feedId}번 댓글 ${commentId}번 삭제 요청 실패`
    );
    console.error(error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};
