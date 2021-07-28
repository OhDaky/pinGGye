const { User: UserModel } = require("../../models");
const db = require("../queryFunction");
const logger = require("../../utils/logger");

module.exports = async (req, res) => {
  const { userId } = req.userInfo;
  const { start, end, limit, order, tlimit, torder } = req.query;

  try {
    const userInfo = await UserModel.findOne({
      where: { id: userId },
    });
    delete userInfo.dataValues.id;
    delete userInfo.dataValues.password;

    const feeds = await db.findAllFeeds(start, end, limit, order);

    const tags = await db.findAllTags(tlimit, torder);

    logger(
      `모든 정보 조회 - 유저 ${userId}: 모든 피드 조회. 옵션(start: ${start}, end: ${end}, limit: ${limit}, order: ${order})`
    );

    res
      .status(200)
      .json({
        data: { userInfo, feeds, tags },
        message: "All feeds, tags, user info successfully read",
      });
  } catch (error) {
    logger(
      `[ERROR] 모든 정보 조회 - 유저 ${userId}: 서버 에러. 모든 정보 조회 요청 실패. 옵션(start: ${start}, end: ${end}, limit: ${limit}, order: ${order})`
    );
    console.error(error);
    return res.status(500).json({ message: "Failed to read all data" });
  }
};
