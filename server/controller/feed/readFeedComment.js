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
    const feed = await db.findFeed(feedId);

    if (!feed) {
      return res.status(400).json({ message: "Feed does not exist" });
    }

    const comments = await db.findFeedComments(feedId);

    res
      .status(200)
      .json({ data: { comments }, message: "Comments successfully read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to read comments" });
  }
};
