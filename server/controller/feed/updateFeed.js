const { Feed: FeedModel, Tag: TagModel } = require("../../models");
const logger = require("../../utils/logger");
const db = require("../queryFunction");

module.exports = async (req, res) => {
  const { userId } = req.userInfo;
  const { id: feedId } = req.params;
  const { subject, tagsText } = req.body;

  if (!feedId || !subject || !tagsText) {
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }

  try {
    //* 변경할 피드 조회
    const feed = await FeedModel.findOne({
      where: { id: feedId, userId: userId }, //! 작성자만 수정 가능
      include: [
        { model: TagModel, required: false, through: { attributes: [] } },
      ],
    });
    if (!feed) {
      return res.status(400).json({ message: "Invalid request" });
    }

    //* 피드 내용 변경
    await feed.update({ subject: subject });
    logger(`피드 ${feedId}번 갱신 완료`);

    //* 기존 태그 삭제
    const existTag = feed.dataValues.Tags;
    await Promise.all(existTag.map((tag) => feed.removeTags(tag)));
    logger(`피드 ${feedId}번 기존 태그 삭제 완료`);

    //* 새로운 태그 입력
    const tags = tagsText.split(",");

    // bulk find or create function
    async function addTagRows(tags) {
      return await Promise.all(tags.map(addTag)); // 각 태그를 태그 테이블에 생성 또는 조회
    }
    async function addTag(name) {
      return TagModel.findOrCreate({
        where: { name },
      });
    }

    const tagInfo = await addTagRows(tags);
    await Promise.all(tagInfo.map((tag) => feed.addTags(tag[0]))); // 피드-태그 조인 테이블에 입력
    logger(`피드 ${feedId}번 새로운 태그 입력 완료`);

    //* 모든 피드 조회 및 응답
    const feeds = await db.findAllFeeds();

    res
      .status(200)
      .json({ data: { feeds }, message: "Feed successfully updated" });
  } catch (error) {
    return res.status(400).json({ message: "Failed to update feed" });
  }
};
