const db = require("../queryFunction");
const logger = require("../../utils/logger");

module.exports = async (req, res) => {
  const { userId } = req.userInfo;
  const { start, end, limit, order } = req.query;

  try {
    const feeds = await db.findAllLikeFeeds(userId, start, end, limit, order);
    logger(`다운로드한 피드 조회 - 유저 ${userId}: 모든 다운로드한 피드 조회. 옵션(start: ${start}, end: ${end}, limit: ${limit}, order: ${order})`);
    
    res
      .status(200)
      .json({ data: { feeds }, message: "All feeds successfully read" });
  } catch (error) {
    logger(`[ERROR] 다운로드한 피드 조회 - 유저 ${userId}: 서버 에러. 모든 다운로드한 피드 조회. 옵션(start: ${start}, end: ${end}, limit: ${limit}, order: ${order})`);
    console.error(error);
    return res.status(500).json({ message: "Failed to read all feeds" });
  }
};
