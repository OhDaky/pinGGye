const { User: UserModel } = require("../../models");
const crypto = require("crypto");
const logger = require("../../utils/logger");
const generateAccessToken = require("../../token/generateAccessToken");

module.exports = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger(`로그인 - 요청 파라미터 부족. email: ${email}`);
    return res
      .status(400)
      .json({ message: "Insufficient parameters supplied" });
  }
  const salt = process.env.PASSWORD_SALT;
  const hashedPassword = crypto
    .createHash("sha512")
    .update(password + salt)
    .digest("hex");
  
  try {
    const userInfo = await UserModel.findOne({
      where: { email: email, signUpType: "email" },
    });

    if (!userInfo) {
      logger(`[ERROR] 로그인 - 존재하지 않거나 소셜 로그인으로 가입한 유저 이메일 ${email}`);
      return res.status(401).json({ message: "Not authorized" });
    }

    if (userInfo.password !== hashedPassword) {
      logger(`[ERROR] 로그인 - 유저 ${userInfo.id}: 이메일 ${email} 비밀번호 오류`);
      return res.status(401).json({ message: "Not authorized" });
    }

    delete userInfo.dataValues.password;
    const accessToken = await generateAccessToken(userInfo);
    logger(`로그인 - 유저 ${userInfo.id}: 이메일 ${email} 로그인 성공. 액세스 토큰 발급 완료`);

    delete userInfo.dataValues.id;
    
    return res
      .status(201)
      .json({ data: { accessToken, userInfo }, message: "Login succeed" });
  } catch (error) {
    logger(`로그인 - 유저 ${userInfo.id}: 서버 에러. 이메일 ${email} 로그인 실패`);
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
