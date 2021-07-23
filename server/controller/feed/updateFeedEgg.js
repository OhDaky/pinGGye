const db = require("../queryFunction");

module.exports = async (req, res) => {
  const { id: feedId } = req.params;
  if (!feedId) {
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }
  try {
    //* 해당 피드 조회
    const feed = await db.findFeed(feedId);
    //* 해당 피드의 다운로드 횟수(알) 증가
    await feed.update({ download: feed.download + 1 });

    //* 모든 피드 조회 및 응답
    const feeds = await db.findAllFeeds();

    res.status(201).json({ data: feeds, message: "Egg count succeed" });
  } catch (error) {
    res.status(201).json({ message: "Egg count failed" });
  }
};
