const { Feed: FeedModel, User: UserModel, Tag: TagModel } = require("../../models");
const s3 = require("../../aws/s3");
const db = require("../queryFunction");

module.exports = async (req, res) => {
  const { userId } = req.userInfo;
  const { id: feedId } = req.params;

  if (!feedId) {
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }

  try {
    //* 삭제할 피드 조회
    const feed = await FeedModel.findOne({ where: { id: feedId, userId: userId } });  //! 작성자 확인 (관리자)
    if (!feed) {
      return res.status(400).json({ message: "Invalid feed" });
    }

    const image = feed.image.split('/').pop();
    const thumbnail = feed.thumbnail.split('/').pop();

    //* 피드 삭제
    await feed.destroy();

    //* 피드 이미지 삭제
    const deleteImage = async (filename) => {
      s3.deleteObject({
        Bucket : 'pinggye-image/image',
        Key: filename
      }, function (error, data) {
        if (error) console.log(error);
      });
    }
    deleteImage(image);
    deleteImage(thumbnail);

    //* 모든 피드 조회 및 응답
    const feeds = await db.findAllFeeds();

    res
      .status(200)
      .json({ data: feeds, message: "Feed delete succeed" });
  } catch (error) {
    return res.status(400).json({ message: "Feed delete failed" });
  }
};
