const db = require("../queryFunction");
const logger = require("../../utils/logger");

module.exports = async (req, res) => {
  const { userId } = req.userInfo;
  const { id: feedId } = req.params;
  const { textContent } = req.body;

  if (!feedId || !textContent) {
    logger(`[ERROR] 피드 댓글 입력 - 유저 ${userId}: 요청 파라미터 부족. feedId: ${feedId} textContent: ${textContent}`);
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }

  try {
    //* 존재하는 피드인지 확인
    const feed = await db.findFeed(feedId);
    
    if (!feed) {
      logger(`[ERROR] 피드 댓글 입력 - 유저 ${userId}: 유효하지 않은 피드 ${feedId}번`);
      return res.status(400).json({ message: "Invalid feed" });
    }
    
    //* 피드에 댓글 등록
    await db.createFeedCommentData(feedId, userId, textContent);
    logger(`피드 댓글 입력 - 유저 ${userId}: 피드 ${feedId}번 댓글 입력 완료`);

    //* 피드의 모든 댓글 조회
    const comments = await db.findFeedComments(feedId);
    logger(`피드 댓글 입력 - 유저 ${userId}: 피드 ${feedId}번 댓글 조회`);

    res
      .status(201)
      .json({ data: { comments }, message: "Comment successfully registerd" });
  } catch (error) {
    logger(`[ERROR] 피드 댓글 입력 - 유저 ${userId}: 서버 에러. 피드 ${feedId}번 댓글 입력 요청 실패`);
    console.error(error);
    return res.status(500).json({ message: "Failed to register comment" });
  }
};
