const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const verifyRefreshToken = async (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_SECRET);
  } catch (error) {
    logger('리프레시 토큰 검증 에러:', error.name);
    // 토큰 기간 만료
    if (error.name === "TokenExpiredError") {
      return { error: "expired" }
    }
    // 유효하지 않은 토큰
    else if (error.name === "JsonWebTokenError") {
      return { error: "invalid" }
    }
  }
};

module.exports = verifyRefreshToken;
