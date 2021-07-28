const logger = require("../../utils/logger");
const db = require("../queryFunction");

module.exports = async (req, res) => {
  const { userId } = req.userInfo;
  const { id: feedId } = req.params;
  
  if (!feedId) {
    logger(`[ERROR] 피드 댓글 조회 - 유저 ${userId}: 요청 파라미터 부족. feedId: ${feedId}`);
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }

  try {
    // 존재하는 피드인지 확인
    const feed = await db.findFeed(feedId);

    if (!feed) {
      logger(`[ERROR] 피드 댓글 조회 - 유저 ${userId}: 유효하지 않은 피드 ${feedId}번 댓글 조회 요청`);
      return res.status(400).json({ message: "Feed does not exist" });
    }

    const comments = await db.findFeedComments(feedId);
    logger(`피드 댓글 조회 - 유저 ${userId}: 피드 ${feedId}번 댓글 조회`);

    res
      .status(200)
      .json({ data: { comments }, message: "Comments successfully read" });
  } catch (error) {
    logger(`[ERROR] 피드 댓글 조회 - 유저 ${userId}: 서버 에러. 피드 ${feedId}번 댓글 조회 요청 실패`);
    console.error(error);
    res.status(500).json({ message: "Failed to read comments" });
  }
};
