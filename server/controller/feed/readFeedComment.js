const db = require("../queryFunction");

module.exports = async (req, res) => {
  const { id: feedId } = req.params;
  if (!feedId) {
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }

  try {
    // 존재하는 피드인지 확인
    const feed = db.findFeed(feedId);
    if (!feed) {
      return res.status(400).json({ message: "Invalid feed" });
    }

    const comments = await db.findFeedComments(feedId);

    res.status(200).json({ data: comments, message: "Send feed's comments" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
