const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");
// dotenv.config();

const verifyAccessToken = async (token) => {
  try {
    console.log('흐음')
    return jwt.verify(token, process.env.ACCESS_SECRET);
  } catch (error) {
    console.log('token errer:', error.name);
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

module.exports = verifyAccessToken;
