const { Feed: FeedModel, User: UserModel, Tag: TagModel } = require("../../models");

module.exports = async (req, res) => {
  if (!req.file) {
    return res.status(500).json({ message: "Image upload error" });
  }
  const imagesInfo = req.file.transforms;

  let original, thumbnail;

  // S3 이미지 서버에 저장된 이미지의 url 경로 획득
  imagesInfo.forEach((image) => {
    if (image.id === "thumbnail") thumbnail = image.location;
    else if (image.id === "original") original = image.location;
  });
  if (!original || !thumbnail) {
    return res.status(500).json({ message: "Image upload error" });
  }

  // DB에 Feed 저장
  const { userId } = req.userInfo;
  const { subject, tags } = req.body;

  if (!userId || !subject || !tags) {
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }

  try {
    // DB에 피드 입력
    const feedInfo = await FeedModel.create({
      userId: userId,
      subject: subject,
      image: "original",
      thumbnail: "thumbnail",
      download: 0,
    });


    // DB에 태그 입력 및 피드와 연결
    // await addTagRows(tags).then((result) => {
    //   result.forEach((el) => {
    //     feedInfo.addTags(el[0]); // 시퀄라이즈 함수
    //   });
    // });

    //* await 추가
    const tagInfo = await addTagRows(tags);
    await Promise.all(tagInfo.map((el) => feedInfo.addTags(el[0])));  // 피드-태그 조인 테이블에 입력

    // bulk find or create function
    async function addTagRows(tags) {
      return await Promise.all(tags.map(addTag)); // 각 태그를 태그 테이블에 생성 또는 조회
    }
    async function addTag(name) {
      return TagModel.findOrCreate({
        where: { name },
      });
    }

    // 모든 피드 조회
    const feeds = await FeedModel.findAll({
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
    });
    // console.log("feeds", feeds);

    // 피드 포맷 변경
    const formattedFeeds = feeds.map((feed) => {
      feed.dataValues.Tags = feed.dataValues.Tags.map((tag) => tag.name);
      feed.dataValues.nickname = feed.dataValues.User.nickname;
      feed.dataValues.User = feed.dataValues.User.email;
      return feed.dataValues;
    });

    res
      .status(201)
      .json({ data: formattedFeeds, message: "Feed upload success" });
  } catch (error) {
    return res.status(500).json({ message: "Feed upload error" });
  }
};
