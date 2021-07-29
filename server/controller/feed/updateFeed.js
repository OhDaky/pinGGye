const { Feed: FeedModel, Tag: TagModel } = require("../../models");
const logger = require("../../utils/logger");

module.exports = async (req, res) => {
  const { userId } = req.userInfo;
  const { id: feedId } = req.params;
  const { subject, tagsText } = req.body;

  if (!feedId || !subject || !tagsText) {
    logger(`[ERROR] 피드 수정 - 유저 ${userId}: 요청 파라미터 부족. feedId: ${feedId} subject: ${subject} tagsText:${tagsText}`);
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }

  try {
    //* 변경할 피드 조회
    const feed = await FeedModel.findOne({
      where: { id: feedId, userId: userId }, //! 작성자만 수정 가능 (관리자 수정 불가)
      include: [
        { model: TagModel, required: false, through: { attributes: [] } },
      ],
    });

    if (!feed) {
      logger(`피드 수정 - 유저 ${userId}: 유효하지 않거나 수정 권한이 없는 피드 ${feedId}번 수정 요청`);
      return res.status(400).json({ message: "Invalid request" });
    }

    //* 피드 내용 변경
    await feed.update({ subject: subject });
    logger(`피드 수정 - 유저 ${userId}: 피드 ${feedId}번 수정 완료`);

    //* 기존 태그 삭제
    const existTag = feed.dataValues.Tags;
    await Promise.all(existTag.map((tag) => feed.removeTags(tag)));
    logger(`피드 수정 -유저 ${userId}:  피드 ${feedId}번 기존 태그 삭제 완료`);

    //* 새로운 태그 입력
    const tags = tagsText.split(",");

    // bulk find or create function
    for (const tag of tags) {
      const [tagInfo, created] = await TagModel.findOrCreate({
        where: { name: tag },
      });
      await feed.addTags(tagInfo);
    }

    logger(`피드 수정 - 유저 ${userId}: 피드 ${feedId}번 신규 태그 입력 완료`);

    res.status(200).json({ message: "Feed successfully updated" });
  } catch (error) {
    logger(`[ERROR] 피드 수정 - 유저 ${userId}: 서버 에러. 피드 ${feedId}번 수정 요청 실패`);
    console.error(error);
    return res.status(500).json({ message: "Failed to update feed" });
  }
};
