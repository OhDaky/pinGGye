const logger = require("../../utils/logger");
const db = require("../queryFunction");

module.exports = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image does not exist" });
  }
  //* S3 이미지 서버에 저장된 이미지의 url 경로 획득
  const imagesInfo = req.file.transforms;
  let imageSrc, thumbnailSrc;

  imagesInfo.forEach((imageInfo) => {
    if (imageInfo.id === "thumbnail") thumbnailSrc = imageInfo.location;
    else if (imageInfo.id === "original") imageSrc = imageInfo.location;
  });

  if (!imageSrc || !thumbnailSrc) {
    return res.status(500).json({ message: "Image upload failed" });
  }

  const { userId } = req.userInfo;
  const { subject, tagsText } = req.body;

  if (!subject || !tagsText) {
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }

  try {
    //* 피드 및 태그 입력
    await db.createFeedData(userId, subject, imageSrc, thumbnailSrc, tagsText);

    //! 피드 조회 및 응답
    const feeds = await db.findAllFeeds();
    logger("피드 생성 - 모든 피드 조회");

    res
      .status(201)
      .json({ data: { feeds }, message: "Feed successfully uploaded" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to upload feed" });
  }
};
