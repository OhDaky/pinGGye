const { User: UserModel } = require("../../models");
const crypto = require('crypto');

const generateAccessToken = require('../../token/generateAccessToken')
// const generateRefreshToken = require('../../token/generateRefreshToken')

module.exports = async (req, res) => {
  console.log(req.body);
  // 입력받은 비밀번호를 해싱해서 db의 값과 비교해야 함

  const { email, password } = req.body;

  const salt = '123';
  const hashedPassword = crypto.createHash('sha512').update(password + salt).digest('hex');

  const userInfo = await UserModel.findOne({
    where: { email: email, password: hashedPassword},
  });
  console.log('유저 정보', userInfo);
  
  if (!userInfo) {
    console.log('잘못된 유저 정보 입력');
    return res.status(401).json({ data: null, message: "Unauthorized" });
  } 
    const accessToken = generateAccessToken(userInfo.id, userInfo.email);
    return res.json({ data: { accessToken }, message: "ok" });
};
