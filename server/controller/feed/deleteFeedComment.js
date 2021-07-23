const { FeedComment: FeedCommentModel } = require("../../models");
const db = require("../queryFunction");

module.exports = async (req, res) => {
  const { id: feedId } = req.params;
  const { commentId } = req.body;
  if (!feedId || !commentId) {
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }

  try {
    const comment = await FeedCommentModel.findOne({ where: { id: commentId } });
    if (!comment) {
      return res.status(400).json({ message: "Invalid comment" });
    }
    
    await comment.destroy();

    const comments = await db.findFeedComments(feedId);
    res.status(201).json({ data: comments, message: "Comment deletion succeed" });
    
  } catch {
    res.status(500).json({ message: "Comment deletion failed" });
  }
};
