const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const generateAccessToken = async (userInfo) => {
  logger("토큰 생성 - 유저 액세스 토큰 생성: ", userInfo.dataValues);
  return jwt.sign(
    {
      userId: userInfo.id,
      email: userInfo.email,
      accountType: userInfo.accountType,
    },
    process.env.ACCESS_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

module.exports = generateAccessToken;
