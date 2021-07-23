const { Feed: FeedModel, Tag: TagModel, User: UserModel, FeedComment: FCModel } = require("../../models");
const crypto = require('crypto');

module.exports = async (req, res) => {
  const { email, password, nickname } = req.body;
  const salt = '123';
  const hashedPassword = crypto.createHash('sha512').update(password + salt).digest('hex');

  if (!email || !password || !nickname) {
    console.log(req.body);
    return res.status(422).send("insufficient parameters supplied");
  }

  await UserModel.findOrCreate({
    where: {
      email,
    },
    defaults: {
      password : hashedPassword, // 비밀번호 해싱값으로 저장! 
      nickname,
      type : "email"
    },
  })
    .then(([result, created]) => {
      console.log('회원가입 요청');
      if (!created) {
        return res.status(409).json({ message:"user alreay exists"});

      }
      // const userInfo = result.dataValues;
      // delete userInfo.password;
      res.status(201).json({ message: "ok" });
    })
    .catch((err) => {
      console.log(err, '실패');
      res.sendStatus(500);
    });
};
