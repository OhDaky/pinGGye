const logger = require("../../utils/logger");
const db = require("../queryFunction");

module.exports = async (req, res) => {
  const { userId } = req.userInfo;
  const { id: feedId } = req.params;

  if (!feedId) {
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }

  try {
    const feed = await db.createLikeFeedData(userId, feedId);
    if (feed.error === "invalid") {
      return res.status(400).json({ message: "Invalid feedId" });
    } else if (feed.error === "exceed") {
      return res
        .status(400)
        .json({ message: "You can't downloaded the image" });
    } else if (feed.error === "exist") {
      return res
        .status(200)
        .json({ message: "You have already downloaded the image" });
    }

    //* 모든 피드 조회 및 응답
    const feeds = await db.findAllFeeds();
    logger(`피드 다운 수 수정 - 모든 피드 조회`);

    res.status(201).json({
      data: { feeds },
      message: "Feed download count successfully updated",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update feed download cound" });
  }
};
