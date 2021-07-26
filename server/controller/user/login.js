const { User: UserModel } = require("../../models");
const crypto = require("crypto");
const logger = require("../../utils/logger");
const generateAccessToken = require("../../token/generateAccessToken");
// const generateRefreshToken = require('../../token/generateRefreshToken');

module.exports = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }
  const salt = process.env.PASSWORD_SALT;
  const hashedPassword = crypto
    .createHash("sha512")
    .update(password + salt)
    .digest("hex");

  const userInfo = await UserModel.findOne({
    where: { email: email },
  });
  //! 소셜 로그인 사용자를 위한 type 필드 검사가 필요? (유저 통합 - nightmare)

  if (!userInfo) {
    logger(`로그인 - 미가입 유저 ${email}`);
    return res.status(401).json({ message: "Not authorized" });
  }

  if (userInfo.signUpType !== "email") {
    logger(`로그인 - 소셜 로그인 가입 유저 ${email}`);
    return res
      .status(409)
      .json({ message: `You sign up with ${userInfo.signUpType}` });
  }

  if (userInfo.password !== hashedPassword) {
    logger(`로그인 - 유저 ${email} 비밀번호 오류`);
    return res.status(401).json({ message: "Not authorized" });
  }

  delete userInfo.dataValues.password;
  const accessToken = await generateAccessToken(userInfo);
  delete userInfo.dataValues.id;

  logger(`로그인 - 유저 ${email} 로그인 성공`);
  //! 리프레시 토큰 유무?
  return res
    .status(201)
    .json({ data: { accessToken, userInfo }, message: "Login succeed" });
};
