const { User: UserModel } = require("../../models");
const crypto = require("crypto");
const logger = require("../../utils/logger");
const generateAccessToken = require("../../token/generateAccessToken");
const generateRefreshToken = require('../../token/generateRefreshToken');

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
      where: { email: email },
    });

    //! 소셜 로그인 사용자를 위한 type 필드 검사가 필요? (유저 통합 - nightmare)

    if (!userInfo) {
      logger(`[ERROR] 로그인 - 가입하지 않은 유저 이메일 ${email}`);
      return res.status(401).json({ message: "Not authorized" });
    }

    if (userInfo.signUpType !== "email") {
      logger(`[ERROR] 로그인 - 소셜 로그인 가입 유저 이메일 ${email}`);
      return res
        .status(409)
        .json({ message: `You sign up with ${userInfo.signUpType}` });
    }

    if (userInfo.password !== hashedPassword) {
      logger(
        `[ERROR] 로그인 - 유저 ${userInfo.id}: 이메일 ${email} 비밀번호 오류`
      );
      return res.status(401).json({ message: "Not authorized" });
    }

    delete userInfo.dataValues.password;
    const accessToken = await generateAccessToken(userInfo);
    logger(
      `로그인 - 유저 ${userInfo.id}: 이메일 ${email} 로그인 성공. 액세스 토큰 발급 완료`
    );
    // const refreshToken = await generateRefreshToken(userInfo);

    // await userInfo.update({ refreshToken });

    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    // });

    // logger(
    //   `로그인 - 유저 ${userInfo.id}: 이메일 ${email} 로그인 성공. 리프레시 토큰 발급 완료`
    // );

    // delete userInfo.dataValues.refreshToken;
    delete userInfo.dataValues.id;
    //! 리프레시 토큰 유무?
    return res
      .status(201)
      .json({ data: { accessToken, userInfo }, message: "Login succeed" });
  } catch (error) {
    logger(
      `로그인 - 유저 ${userInfo.id}: 서버 에러. 이메일 ${email} 로그인 실패`
    );
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
