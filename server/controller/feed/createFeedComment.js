const { FeedComment: FeedCommentModel } = require("../../models");
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

    //* DB에 피드 댓글 입력
    const comment = await FeedCommentModel.create({
      feedId: feedId,
      userId: userId,
      textContent: textContent,
    });
    logger(`피드 ${feedId}번 댓글 ${comment.id}번 입력 완료`);

    // * 해당 피드의 모든 댓글 전송
    const comments = await db.findFeedComments(feedId);

    res
      .status(201)
      .json({ data: { comments }, message: "Comment successfully registerd" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to register comment" });
  }
};
