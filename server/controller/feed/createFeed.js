const db = require("../queryFunction");
const logger = require("../../utils/logger");

module.exports = async (req, res) => {
  const { userId } = req.userInfo;
  const { subject, tagsText } = req.body;

  if (!req.file) {
    logger(`[ERROR] 피드 입력 - 유저 ${userId}: 이미지 없음`);
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
    logger(`[ERROR] 피드 입력 - 유저 ${userId}: 이미지 주소 획득 실패. imageSrc: ${imageSrc} thumbnailSrc: ${thumbnailSrc}`);
    return res.status(500).json({ message: "Image upload failed" });
  }
  logger(`피드 입력 - 유저 ${userId}: 이미지 주소 획득 완료`);

  if (!subject || !tagsText) {
    logger(`[ERROR] 피드 입력 - 유저 ${userId}: 요청 파라미터 부족. subject: ${subject} tagsText: ${tagsText}`);
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }

  try {
    //* 피드 및 태그 입력
    const feed = await db.createFeedData(
      userId,
      subject,
      imageSrc,
      thumbnailSrc,
      tagsText
    );
    logger(`피드 입력 - 유저 ${userId}: 피드 ${feed.id}번 입력 완료`);

    res.status(201).json({ message: "Feed successfully uploaded" });
  } catch (error) {
    logger(`[ERROR] 피드 입력 - 유저 ${userId}: 서버 에러. 피드 ${feed.id}번 입력 요청 실패`);
    console.error(error);
    return res.status(500).json({ message: "Failed to upload feed" });
  }
};
