const {
  Feed: FeedModel,
  User: UserModel,
  FeedComment: FeedCommentModel,
} = require("../../models");
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
    const feed = db.findFeed(feedId);
    if (!feed) {
      return res.status(400).json({ message: "Invalid feed" });
    }

    //* DB에 피드 댓글 입력
    const comment = await FeedCommentModel.create({
      feedId: feedId,
      userId: userId,
      textContent: textContent,
    });

    // * 해당 피드의 모든 댓글 전송
    const comments = await db.findFeedComments(feedId);

    res
      .status(201)
      .json({ data: comments, message: "Feed comment create succeed" });
  } catch (error) {
    return res.status(500).json({ message: "Feed comment create failed" });
  }
};
