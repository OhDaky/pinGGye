const { User: UserModel } = require("../../models");
const crypto = require("crypto");

module.exports = async (req, res) => {
  const { email, password, nickname } = req.body;
  const salt = process.env.PASSWORD_SALT;
  const hashedPassword = crypto
    .createHash("sha512")
    .update(password + salt)
    .digest("hex");

  if (!email || !password || !nickname) {
    console.log(req.body);
    return res.status(422).send("insufficient parameters supplied");
  }

  await UserModel.findOrCreate({
    where: {
      email,
    },
    defaults: {
      password: hashedPassword, // 비밀번호 해싱값으로 저장!
      nickname,
      signUpType: "email",
      accountType: "user"
    },
  })
    .then(([result, created]) => {
      console.log("회원가입 요청");
      if (!created) {
        return res.status(409).json({ message: "Email already exists"});
      }
      // const userInfo = result.dataValues;
      // delete userInfo.password;
      res.status(201).json({ message: "User registration completed" });
    })
    .catch((err) => {
      console.log(err, "실패");
      res.sendStatus(500);
    });
};
