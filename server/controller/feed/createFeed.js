const { Feed: FeedModel, User: UserModel, Tag: TagModel } = require("../../models");

module.exports = async (req, res) => {
  const { userId } = req.userInfo;
  const { subject, tags, imageSrc: image, thumbnailSrc: thumbnail } = req.body;

  if (!userId || !subject || !tags || !image || !thumbnail) {
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }

  try {
    //* DB에 피드 입력
    const feedInfo = await FeedModel.create({
      userId: userId,
      subject: subject,
      image: image,
      thumbnail: thumbnail,
      download: 0,
    });

    //* DB에 태그 입력 및 피드와 연결
    const tagInfo = await addTagRows(tags);
    await Promise.all(tagInfo.map((tag) => feedInfo.addTags(tag[0])));  // 피드-태그 조인 테이블에 입력

    // bulk find or create function
    async function addTagRows(tags) {
      return await Promise.all(tags.map(addTag)); // 각 태그를 태그 테이블에 생성 또는 조회
    }
    async function addTag(name) {
      return TagModel.findOrCreate({
        where: { name },
      });
    }

    //* 모든 피드 조회
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

    // 피드 포맷 변경
    const formattedFeeds = feeds.map((feed) => {
      feed.dataValues.Tags = feed.dataValues.Tags.map((tag) => tag.name);
      feed.dataValues.nickname = feed.dataValues.User.nickname;
      feed.dataValues.User = feed.dataValues.User.email;
      return feed.dataValues;
    });

    res
      .status(201)
      .json({ data: formattedFeeds, message: "Feed upload succeed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Feed upload failed" });
  }
};
