const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const generateAccessToken = async (userInfo) => {
  logger('유저 액세스 토큰 생성: ', userInfo.dataValues);
  return jwt.sign(
    {
      userId: userInfo.id,
      email: userInfo.email,
      accountType: userInfo.accountType,
    },
    process.env.ACCESS_SECRET,
    {
      expiresIn: "2h",
    }
  );
};

module.exports = generateAccessToken;
