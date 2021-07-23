const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");
// dotenv.config();

const generateAccessToken = async (userInfo) => {
  console.log('사용자 액세스 토큰 생성', userInfo.dataValues);
  return jwt.sign(
    {
      userId: userInfo.id,
      email: userInfo.email,
      accountType: userInfo.accountType,
    },
    process.env.ACCESS_SECRET,
    {
      expiresIn: "12h",
    }
  );
};

module.exports = generateAccessToken;
