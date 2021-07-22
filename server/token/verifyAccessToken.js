const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");
// dotenv.config();

const verifyToken = async (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_SECRET);
  } catch (error) {
    // 토큰 기간 만료
    if (error.name === "TokenExpiredError") {
      return "TokenExpiredError";
    }
    // 유효하지 않은 토큰
    else if (error.name === "JsonWebTokenError") {
      return "JsonWebTokenError";
    }
  }
};

module.exports = verifyToken;
