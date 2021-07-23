const {
  Feed: FeedModel,
  User: UserModel,
  Tag: TagModel,
} = require("../../models");
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
    return res.status(500).json({ data: null, message: "Image upload failed" });
  }

  const { userId } = req.userInfo;
  const { subject, tagsText } = req.body;

  if (!subject || !tagsText || !imageSrc || !thumbnailSrc) {
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

    //* DB에 태그 입력 및 피드와 연결
    const tags = tagsText.split(",");

    const tagInfo = await addTagRows(tags);
    await Promise.all(tagInfo.map((tag) => feed.addTags(tag[0]))); // 피드-태그 조인 테이블에 입력

    // bulk find or create function
    async function addTagRows(tags) {
      return await Promise.all(tags.map(addTag)); // 각 태그를 태그 테이블에 생성 또는 조회
    }
    async function addTag(name) {
      return TagModel.findOrCreate({
        where: { name },
      });
    }

    //* 모든 피드 조회 및 응답
    const feeds = await db.findAllFeeds();

    res.status(201).json({ data: feeds, message: "Feed upload succeed" });
  } catch (error) {
    return res.status(500).json({ message: "Feed upload failed" });
  }
};
