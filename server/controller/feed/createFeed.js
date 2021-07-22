const { Feed: FeedModel, User: UserModel } = require("../../models");

// 토큰으로 사용자 검증 필요

module.exports = async (req, res) => {
  const imagesInfo = req.file.transforms;
  let original, thumbnail;

  imagesInfo.forEach((image) => {
    if (image.id === 'thumbnail') thumbnail = image.location;
    else if (image.id === 'original') original = image.location;
  })

  if (!original || !thumbnail) {
    // 파일 업로드 에러
  }
  
  res.json({ original, thumbnail });
  //이후 DB에 해당 사용자 id로 feed 입력
  // -> 모든 피드 재전송
};