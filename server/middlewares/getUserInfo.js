const { User: UserModel } = require("../models");
const verifyAccessToken = require("../token/verifyAccessToken");
const axios = require("axios");

const googleProfileUrl = "https://www.googleapis.com/oauth2/v3/userinfo";

//* 현재 기존 회원만 인증 가능 (소셜 로그인 미구현)
const getUserInfo = async (accessToken, loginType) => {
  const userInfo = {
    userId: null,
    email: null,
    accountType: null,
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
      userInfo.accountType = decoded.accountType;
    }
  } else if (loginType === "google") {
    //* access token으로 Google api에 요청을 보내 유저 정보 획득
    let googleUserInfo;
    try {
      googleUserInfo = await axios.get(googleProfileUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(googleUserInfo.data)
    } catch (error) {
      // console.log(error);
      console.error("##",error.response.data);
      //! 응답 데이터에 따라 만료, 유효하지 않음 분기 필요
      userInfo.error = "expired";
      return userInfo;
    }

    const { email } = googleUserInfo.data;
    try {
      googleUserInfo = await UserModel.findOne({
        where: { email: email, signUpType: loginType },
      });
    } catch (error) {
      console.error(error);
      userInfo.error = "error";
      return userInfo;
    }

    userInfo.userId = googleUserInfo.id;
    userInfo.email = googleUserInfo.email;
    userInfo.accountType = googleUserInfo.accountType;
  }
  return userInfo;
};

module.exports = getUserInfo;
