const { Feed: FeedModel } = require("../../models");
const s3 = require("../../aws/s3");
const logger = require("../../utils/logger");

module.exports = async (req, res) => {
  const { userId, accountType } = req.userInfo;
  const { id: feedId } = req.params;

  if (!feedId) {
    logger(`[ERROR] 피드 삭제 - 유저 ${userId}: 요청 파라미터 부족. feedId: ${feedId}`);
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }

  try {
    //* 삭제할 피드 조회
    let feed;
    if (accountType === "admin") {
      //! 관리자 권한 - 작성자에 관계 없이 삭제 가능
      logger(`피드 삭제 - 유저 ${userId}: 피드 ${feedId}번 관리자 권한 삭제 요청`);
      feed = await FeedModel.findOne({ where: { id: feedId } });
    } else {
      logger(`피드 삭제 - 유저 ${userId}: 피드 ${feedId}번 삭제 요청`);
      feed = await FeedModel.findOne({ where: { id: feedId, userId: userId } });
    }
    if (!feed) {
      logger(`[ERROR] 피드 삭제 - 유저 ${userId}: 유효하지 않거나 삭제 권한이 없는 피드 ${feedId}번 삭제 요청`);
      return res.status(400).json({ message: "Invalid request" });
    }

    // 이미지 경로에서 이름 추출
    const image = feed.image.split("/").pop();
    const thumbnail = feed.thumbnail.split("/").pop();

    //* 피드 삭제
    await feed.destroy();
    logger(`피드 삭제 - 유저 ${userId}: 피드 ${feedId}번 삭제 완료`);

    //* 피드 이미지 삭제
    const deleteImage = async (filename) => {
      s3.deleteObject(
        {
          Bucket: "pinggye-image/image",  //! dummy 이미지는 삭제되지 않음
          Key: filename,
        },
        function (error, data) {
          if (error) {
            console.error(error);
          }
        }
      );
    };
    deleteImage(image);
    deleteImage(thumbnail);
    logger(`피드 삭제 - 유저 ${userId}: 피드 ${feedId}번 이미지 삭제 완료`);

    res.status(201).json({ message: "Feed successfully deleted" });
  } catch (error) {
    logger(`[ERROR] 피드 삭제 - 유저 ${userId}: 서버 에러. 피드 ${feedId} 삭제 요청 실패`);
    console.error(error);
    return res.status(500).json({ message: "Failed to delete feed" });
  }
};
