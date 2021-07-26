const logger = require("../../utils/logger");
const db = require("../queryFunction");

module.exports = async (req, res) => {
  const { userId } = req.userInfo;
  const { limit, order } = req.query;

  try {
    const tags = await db.findAllTags(limit, order);
    logger(`태그 조회 - 유저 ${userId}: 모든 태그 조회. 옵션(limit: ${limit}, order: ${order})`);

    res
      .status(200)
      .json({ data: { tags }, message: "All tags successfully read" });
  } catch (error) {
    logger(`[ERROR] 태그 조회 - 유저 ${userId}: 서버 에러. 모든 태그 조회 요청 실패. 옵션(limit: ${limit}, order: ${order})`);
    console.error(error);
    return res.status(500).json({ message: "Failed to read all tags" });
  }
};
