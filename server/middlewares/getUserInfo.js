const jwt = require("jsonwebtoken");
const verifyAccessToken = require("../token/verifyAccessToken");
// const dotenv = require("dotenv");
// dotenv.config();

//* 현재 기존 회원만 인증 가능
const getUserInfo = async (accessToken, loginType) => {
  const userInfo = {
    userId,
    email,
  };

  if (loginType === "email") {
    const decoded = await verifyAccessToken(accessToken);

    if (decoded === "TokenExpiredError") {
      res.status(403).json({ message: "Expired token" });
    } else if (decoded === "JsonWebTokenError") {
      res.status(403).json({ message: "Invalid token" });
    } else {
      userInfo.userId = decoded.userId;
      userInfo.email = decoded.email;
    }

    //! DB 조회 필요성?
  } else if (loginType === "google") {
  }

  return userInfo;
};

module.exports = getUserInfo;
