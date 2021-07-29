const db = require("../queryFunction");
const logger = require("../../utils/logger");
const { checkEmail, checkPassword } = require("../../utils/validator");

module.exports = async (req, res) => {
  const { email, password, nickname } = req.body;

  if (!email || !password || !nickname) {
    logger(`회원가입 - 요청 파라미터 부족. email=${email} nickname=${nickname}`);
    return res.status(400).json({ message: "Insufficient parameters supplied"});
  }

  if (!checkEmail(email) || !checkPassword(password) || nickname === "") {
    logger(`회원가입 - 요청 파라미터 에러. email=${email} nickname=${nickname}`);
    return res.status(400).json({ message: "Invalid format"});
  }

  try {
    const result = await db.createUserData(
      email,
      password,
      nickname,
      "email",
      "user"
    );

    if (result.error) {
      res.status(409).json({ message: "Email already exists" });
    } else {
      res.status(201).json({ message: "User registration completed" });
    }
  } catch (error) {
    logger(`[ERROR] 회원가입 - 서버 에러. 유저 ${email} 회원가입 실패`);
    console.error(error);
    res.status(500).json({ message: "User registration failed" });
  }
};
