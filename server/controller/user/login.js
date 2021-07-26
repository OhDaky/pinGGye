const { User: UserModel } = require("../../models");
const crypto = require("crypto");

const generateAccessToken = require("../../token/generateAccessToken");
// const generateRefreshToken = require('../../token/generateRefreshToken')

module.exports = async (req, res) => {
  // console.log(req.body);
  // 입력받은 비밀번호를 해싱해서 db의 값과 비교해야 함

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
  //* 소셜 로그인 사용자를 위한 type 필드 검사가 필요?

  if (!userInfo) {
    console.log("가입하지 않은 유저");
    return res.status(401).json({ message: "Not authorized" });
  }

  if (userInfo.signUpType !== "email") {
    console.log("소셜 로그인으로 가입한 유저");
    return res.status(409).json({ message: `You sign up with ${userInfo.signUpType}` });
  }

  if (userInfo.password !== hashedPassword) {
    console.log("비밀 번호 오류");
    return res.status(401).json({ message: "Not authorized" });
  }

  delete userInfo.dataValues.password;
  const accessToken = await generateAccessToken(userInfo);
  delete userInfo.dataValues.id;

  //! 리프레시 토큰 유무?
  return res
    .status(201)
    .json({ data: { accessToken, userInfo }, message: "Login succeed" });
};