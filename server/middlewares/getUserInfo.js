const verifyAccessToken = require("../token/verifyAccessToken");
// const dotenv = require("dotenv");
// dotenv.config();

//* 현재 기존 회원만 인증 가능
const getUserInfo = async (accessToken, loginType) => {
  const userInfo = {
    userId: null,
    email: null,
  };

  if (loginType === "email") {
    const decoded = await verifyAccessToken(accessToken);

    // console.log(decoded);
    if (decoded.error === "expired") {
      userInfo.error = "expired";
    } else if (decoded.error === "invalid") {
      userInfo.error = "invalid";
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
