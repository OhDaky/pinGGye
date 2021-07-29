const { User: UserModel } = require("../models");
const verifyAccessToken = require("../token/verifyAccessToken");
const axios = require("axios");
const logger = require("../utils/logger");

// const googleTokenUrl = "https://oauth2.googleapis.com/token";
const googleProfileUrl = "https://www.googleapis.com/oauth2/v3/userinfo";

const getUserInfo = async (accessToken, loginType) => {
  const userInfo = {
    userId: null,
    email: null,
    accountType: null,
  };

  if (loginType === "email") {
    const decoded = await verifyAccessToken(accessToken);

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
    let googleUserInfo; //? 재할당 변수
    try {
      googleUserInfo = await axios.get(googleProfileUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      logger(
        "소셜 로그인 유저 토큰 검증(API 요청) - 유저 정보: ",
        googleUserInfo.data
      );
    } catch (error) {
      logger("소셜 로그인 유저 토큰 검증 실패");
      console.error(error.response.data);
      userInfo.error = "invalid";
      return userInfo;
    }

    //* DB에서 사용자 정보 조회
    const { email } = googleUserInfo.data;
    try {
      googleUserInfo = await UserModel.findOne({
        where: { email: email, signUpType: loginType },
      });
      if (!googleUserInfo) {
        logger("소셜 로그인 유저 조회 실패. 가입돼 있지 않음");
        userInfo.error = "invalid";
        return userInfo;
      }
      userInfo.userId = googleUserInfo.id;
      userInfo.email = googleUserInfo.email;
      userInfo.accountType = googleUserInfo.accountType;
    } catch (error) {
      logger("소셜 로그인 유저 조회 실패. 서버 에러");
      console.error(error);
      userInfo.error = "error";
      return userInfo;
    }
  }
  return userInfo;
};

module.exports = getUserInfo;
