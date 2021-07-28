const { User: UserModel } = require("../../models");
const crypto = require("crypto");
const logger = require("../../utils/logger");

module.exports = async (req, res) => {
  const { userId, email } = req.userInfo;
  const { nickname, password } = req.body;

  if (!password || !nickname) {
    logger(`유저 정보 수정 - 요청 파라미터 부족. nickname=${nickname}`);
    return res.status(422).send("insufficient parameters supplied");
  }

  if (password === "" || nickname === "") {
    logger(`유저 정보 수정 - 요청 파라미터 에러. nickname=${nickname}`);
    return res.status(422).send("insufficient parameters supplied");
  }

  const salt = process.env.PASSWORD_SALT;
  const hashedPassword = crypto
    .createHash("sha512")
    .update(password + salt)
    .digest("hex");

  try {
    const userInfo = await UserModel.findOne({
      where: { id: userId, password: hashedPassword },
    });

    if (!userInfo) {
      logger(`유저 정보 수정 - 유저 ${email} 없음`);
      return res.status(400).json({ message: "User not found" });
    }
    userInfo.update({ nickname });

    delete userInfo.dataValues.password;
    logger(`유저 정보 수정 - 유저 ${email} 닉네임 수정 완료`);

    res
      .status(201)
      .json({ data: { userInfo }, message: "User info successfully updated" });
  } catch (error) {
    logger(`[ERROR] 유저 정보 수정 - 서버 에러. 유저 ${email} 정보 수정 실패`);
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
