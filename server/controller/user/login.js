const {
  Feed: FeedModel,
  Tag: TagModel,
  User: UserModel,
  FeedComment: FCModel,
} = require("../../models");
const crypto = require("crypto");

const generateAccessToken = require("../../token/generateAccessToken");
// const generateRefreshToken = require('../../token/generateRefreshToken')

module.exports = async (req, res) => {
  console.log(req.body);
  // 입력받은 비밀번호를 해싱해서 db의 값과 비교해야 함

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Insufficient parameters supplied" });
  }

  const salt = "123";
  const hashedPassword = crypto
    .createHash("sha512")
    .update(password + salt)
    .digest("hex");

  const userInfo = await UserModel.findOne({
    where: { email: email, password: hashedPassword },
  });

  if (!userInfo) {
    console.log("잘못된 유저 정보 입력");
    return res.status(401).json({ data: null, message: "not authorized" });
  }
  delete userInfo.dataValues.password;
  const accessToken = await generateAccessToken(userInfo.id, userInfo.email);

  // console.log(accessToken);
  return res.status(201).json({ data: { accessToken, userInfo }, message: "ok" });
};
