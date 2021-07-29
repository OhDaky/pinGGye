const db = require("../queryFunction");
const logger = require("../../utils/logger");

module.exports = async (req, res) => {
  const { userId } = req.userInfo;
  const { id: feedId } = req.params;

  if (!feedId) {
    logger(`[ERROR] 피드 다운 수 수정 - 유저 ${userId}: 요청 파라미터 부족. feedId: ${feedId}`);
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }

  try {
    const feed = await db.createLikeFeedData(userId, feedId);

    if (feed.error === "invalid") {
      // 존재하지 않는 피드
      return res.status(400).json({ message: "Invalid feed" });
    } else if (feed.error === "mine") {
      // 자신이 작성한 피드
      return res.status(200).json({ message: "It's your feed!" });
    } else if (feed.error === "exceed") {
      // 다운 횟수를 초과한 피드
      return res
        .status(400)
        .json({ message: "You can't downloaded the image" });
    } else if (feed.error === "exist") {
      // 이미 다운로드를 누른 피드
      return res
        .status(200)
        .json({ message: "You have already downloaded the image" });
    }

    //* 모든 피드 조회 및 응답
    const feeds = await db.findAllFeeds();
    logger(`피드 다운 수 수정 - 유저 ${userId}: 모든 피드 조회`);

    res.status(201).json({
      data: { feeds },
      message: "Feed download count successfully updated",
    });
  } catch (error) {
    logger(`[ERROR] 피드 다운 수 수정 - 유저 ${userId}: 서버 에러. 피드 ${feedId}번 다운로드 요청 실패`);
    console.error(error);
    res.status(500).json({ message: "Failed to update feed download cound" });
  }
};
