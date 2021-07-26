const { User: UserModel } = require("../../models");
const crypto = require("crypto");
const logger = require("../../utils/logger");

// 유저 정보 수정
// 클라이언트로부터 PATCH 요청을 받는다 (payload: 수정된 이메일 or 수정된 닉네임, 토큰)
// 요청에 있는 유저 아이디과 일치하는 유저 아이디를 DB에서 찾는다.
// 수정할 유저 정보를 DB에 저장한다 (nickname)
// 수정된 유저 정보를 응답으로 보낸다.

module.exports = async (req, res) => {
  const { userId, email } = req.userInfo;
  const { nickname, password } = req.body;

  const salt = process.env.PASSWORD_SALT;
  const hashedPassword = crypto
    .createHash("sha512")
    .update(password + salt)
    .digest("hex");

  const userInfo = await UserModel.findOne({
    where: { id: userId, password: hashedPassword },
  });

  if (!userInfo) {
    logger(`유저 정보 수정 - 유저 ${email} 없음`);
    return res.status(400).json({ message: "User not found" });
  }

  userInfo.dataValues.nickname = nickname;
  delete userInfo.dataValues.password;
  logger(`유저 정보 수정 - 유저 ${email} 닉네임 수정 완료`);

  res
    .status(201)
    .json({ data: { userInfo }, message: "User info successfully updated" });
};
