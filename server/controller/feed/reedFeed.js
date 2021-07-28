// 해당 피드와 피드의 댓글 읽어옴
const {
  Feed: FeedModel,
  User: UserModel,
  Tag: TagModel,
} = require("../../models");

const logger = require("../../utils/logger");
const db = require("../queryFunction");

module.exports = async (req, res) => {
  const { userId } = req.userInfo;
  const { id: feedId } = req.params;
  if (!feedId) {
    logger(`[ERROR] 피드 조회 - 유저 ${userId}: 요청 파라미터 부족. feedId: ${feedId}`);
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }

  try {
    // 존재하는 피드인지 확인
    const feed = await FeedModel.findOne({
      attributes: [
        "id",
        "subject",
        "image",
        "thumbnail",
        "download",
        "createdAt",
        "updatedAt",
      ],
      include: [
        { model: TagModel, required: false, through: { attributes: [] } },
        { model: UserModel },
      ],
      where: {
        id: feedId
      }
    });

    if (!feed) {
      logger(`[ERROR] 피드 조회 - 유저 ${userId}: 유효하지 않은 피드 ${feedId}번 조회 요청`);
      return res.status(400).json({ message: "Feed does not exist" });
    }
    logger(`피드 조회 - 유저 ${userId}: 피드 ${feedId}번 조회`);

    //* 피드 포맷 변경
    feed.dataValues.tags = feed.dataValues.Tags.map((tag) => tag.name);
    feed.dataValues.nickname = feed.dataValues.User.nickname;
    feed.dataValues.email = feed.dataValues.User.email;
    delete feed.dataValues.Tags;
    delete feed.dataValues.User;

    //* 피드 댓글 조회
    const comments = await db.findFeedComments(feedId);
    logger(`피드 조회 - 유저 ${userId}: 피드 ${feedId}번 댓글 조회`);

    res
      .status(200)
      .json({ data: { feed, comments }, message: "Feed and comments successfully read" });
  } catch (error) {
    logger(`[ERROR] 피드 조회 - 유저 ${userId}: 서버 에러. 피드 ${feedId} 댓글 조회 요청 실패`);
    console.error(error);
    res.status(500).json({ message: "Failed to read feed and comments" });
  }
};
