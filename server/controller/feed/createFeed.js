const { Feed: FeedModel, Tag: TagModel } = require("../../models");
const logger = require("../../utils/logger");
const db = require("../queryFunction");

module.exports = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image does not exist" });
  }
  const imagesInfo = req.file.transforms;

  let imageSrc, thumbnailSrc;

  //* S3 이미지 서버에 저장된 이미지의 url 경로 획득
  imagesInfo.forEach((imageInfo) => {
    if (imageInfo.id === "thumbnail") thumbnailSrc = imageInfo.location;
    else if (imageInfo.id === "original") imageSrc = imageInfo.location;
  });

  if (!imageSrc || !thumbnailSrc) {
    return res.status(500).json({ message: "Image upload failed" });
  }

  const { userId } = req.userInfo;
  const { subject, tagsText } = req.body;

  //? 태그 확인 정규식 필요?

  if (!subject || !tagsText) {
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }

  try {
    //* DB에 피드 입력
    const feed = await FeedModel.create({
      userId: userId,
      subject: subject,
      image: imageSrc,
      thumbnail: thumbnailSrc,
      download: 0,
    });
    logger(`피드 ${feed.id}번 입력 완료`);

    //* DB에 태그 입력 및 피드와 연결
    const tags = tagsText.split(",");

    // bulk find or create function
    // async function addTagRows(tags) {
    //   return await Promise.all(tags.map((tag) => addTag(tag)));
    // }
    // async function addTag(name) {
    //   return TagModel.findOrCreate({
    //     where: { name },
    //   });
    // }
    // const tagInfo = await addTagRows(tags); // 각 태그를 태그 테이블에 생성 또는 조회
    // await Promise.all(tagInfo.map((tag) => feed.addTags(tag[0]))); // 태그를 기준으로 피드-태그 조인 테이블에 입력
    
    for (const tag of tags) {
      const [tagInfo, created] = await TagModel.findOrCreate({
        where: { name: tag },
      });
      await feed.addTags((tagInfo));
    }
    logger("태그, 피드-태그 입력 완료");

    //* 모든 피드 조회 및 응답
    const feeds = await db.findAllFeeds();
    logger("피드 조회");

    res
      .status(201)
      .json({ data: { feeds }, message: "Feed successfully uploaded" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to upload feed" });
  }
};
