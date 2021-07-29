const { User: UserModel } = require("../../../models");
const crypto = require("crypto");
const logger = require("../../../utils/logger");

module.exports = async (email, password, nickname, signUpType, accountType) => {
  const salt = process.env.PASSWORD_SALT;
  const hashedPassword = crypto
    .createHash("sha512")
    .update(password + salt)
    .digest("hex");
  
  signUpType = signUpType || "email";
  accountType = accountType || "user";
  
  const [userInfo, created] = await UserModel.findOrCreate({
    where: {
      email,
    },
    defaults: {
      password: hashedPassword, // 비밀번호 해싱값으로 저장!
      nickname,
      signUpType,
      accountType,
    },
  });
  if (!created) {
    logger(`회원가입 - 이메일 ${userInfo.email} 중복된 이메일 가입 요청`);
    userInfo.error = "exist";
    return userInfo;
  }
  logger(`회원가입 - 유저 ${userInfo.id}: 이메일 ${userInfo.email} 닉네임 ${userInfo.nickname} 가입 완료`);
  return userInfo;
};
