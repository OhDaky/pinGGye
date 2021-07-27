const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const generateRefreshToken = async (userInfo) => {
  logger("토큰 생성 -  유저 리프레시 토큰 생성: ", userInfo.dataValues);
  return jwt.sign(
    {
      userId: userInfo.id,
      email: userInfo.email,
      accountType: userInfo.accountType,
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "14d",
    }
  );
};

module.exports = generateRefreshToken;
