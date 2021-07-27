const { Feed: FeedModel, Tag: TagModel } = require("../../../models");
const logger = require("../../../utils/logger");

module.exports = async (userId, subject, imageSrc, thumbnailSrc, tagsText) => {
  //* DB에 피드 입력
  const feed = await FeedModel.create({
    userId: userId,
    subject: subject,
    image: imageSrc,
    thumbnail: thumbnailSrc,
    download: 0,
  });
  logger(`유저 ${userId}: 피드 ${feed.id}번 입력 완료. 제목: ${subject} 태그: ${tagsText}`);

  //* DB에 태그 입력 및 피드와 연결
  const tags = tagsText.split(",");
  for (const tag of tags) {
    const [tagInfo, created] = await TagModel.findOrCreate({
      where: { name: tag },
    });
    await feed.addTags(tagInfo);
  }
  logger(`유저 ${userId}: 피드 ${feed.id}번 태그 입력 및 연결 완료`);

  return feed;
};
