const logger = require("../../utils/logger");
const db = require("../queryFunction");

module.exports = async (req, res) => {
  const { userId } = req.userInfo;
  const { id: feedId } = req.params;
  const { textContent } = req.body;

  if (!feedId || !textContent) {
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }

  try {
    //* 존재하는 피드인지 확인
    const feed = await db.findFeed(feedId);
    if (!feed) {
      return res.status(400).json({ message: "Invalid feed" });
    }
    //* 피드에 댓글 등록
    await db.createFeedCommentData(feedId, userId, textContent);

    //* 피드의 모든 댓글 조회
    const comments = await db.findFeedComments(feedId);
    logger(`피드 댓글 생성 - 피드 ${feedId}번 댓글 조회`);

    res
      .status(201)
      .json({ data: { comments }, message: "Comment successfully registerd" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to register comment" });
  }
};
