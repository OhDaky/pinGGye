const { Feed: FeedModel } = require("../../models");
const s3 = require("../../aws/s3");
const db = require("../queryFunction");
const logger = require("../../utils/logger");

module.exports = async (req, res) => {
  const { userId, accountType } = req.userInfo;
  const { id: feedId } = req.params;

  if (!feedId) {
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }

  try {
    //* 삭제할 피드 조회
    let feed;
    if (accountType === "admin") {
      //! 관리자 권한
      feed = await FeedModel.findOne({ where: { id: feedId } }); // 작성자에 관계 없이 삭제 가능
    } else {
      feed = await FeedModel.findOne({ where: { id: feedId, userId: userId } });
    }
    if (!feed) {
      return res.status(400).json({ message: "Invalid request" }); // 유효하지 않은 피드 번호 또는 권한 오류
    }

    // 이미지 경로에서 이름 추출
    const image = feed.image.split("/").pop();
    const thumbnail = feed.thumbnail.split("/").pop();

    //* 피드 삭제
    await feed.destroy();
    logger(`피드 ${feedId}번 삭제 완료`);

    //* 피드 이미지 삭제
    const deleteImage = async (filename) => {
      s3.deleteObject(
        {
          Bucket: "pinggye-image/image",
          Key: filename,
        },
        function (error, data) {
          if (error) console.log(error);
        }
      );
    };
    deleteImage(image);
    deleteImage(thumbnail);
    logger(`피드 ${feedId}번 이미지 삭제 완료`);

    //* 모든 피드 조회 및 응답
    const feeds = await db.findAllFeeds();

    res
      .status(201)
      .json({ data: { feeds }, message: "Feed successfully deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete feed" });
  }
};
