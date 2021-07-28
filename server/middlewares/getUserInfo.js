const { User: UserModel } = require("../models");
const generateAccessToken = require("../token/generateAccessToken");
const verifyAccessToken = require("../token/verifyAccessToken");
const verifyRefreshToken = require("../token/verifyRefreshToken");
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
      //! 리프레시 토큰 검증 (보류)
      // const refreshToken = userInfoDB.refreshfToken;

      // const decodedRefresh = await verifyRefreshToken(refreshToken);

      // if (decodedRefresh.error === "expired") {
      //   //? 재로그인 필요 -> 리프래시 토큰 재발급
      //   userInfo.error = "expired";
      //   return userInfo;
      // } else if (decodedRefresh.error === "invalid") {
      //   userInfo.error = "invalid";
      //   return userInfo;
      // } else {
      //   //? 액세스 토큰을 다시 보내고, 클라이언트의 재요청이 필요
      //   const userInfoDB = await UserModel.findOne({
      //     where: { email: decodedRefresh.email, signUpType: loginType },
      //   });

      //   const newAccessToken = generateAccessToken(userInfoDB);

      //   userInfo.accessToken = newAccessToken
      //   userInfo.userId = decodedRefresh.userId;
      //   userInfo.email = decodedRefresh.email;
      //   userInfo.accountType = decodedRefresh.accountType;
      // }
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
      //! 리프레시 토큰으로 새로운 액세스 토큰 발급 (보류)
      //   logger("소셜 로그인 유저 토큰 검증 실패 - 액세스 토큰 재발급 요청");

      //   //* 유저의 리프레시 토큰 획득
      //   googleUserInfo = await UserModel.findOne({
      //     where: { email: email, signUpType: loginType },
      //   });

      //   if (!googleUserInfo) {
      //     //? 가입하지 않은 유저
      //     logger("소셜 로그인 유저 토큰 검증 실패 - 가입되지 않은 유저");
      //     userInfo.error = "invalid";
      //     return userInfo;
      //   }

      //   const googleRefreshToken = googleUserInfo.refreshToken;
      //   if (!googleRefreshToken) {
      //     logger("소셜 로그인 유저 토큰 검증 실패 - 리프레시 토큰 없음");
      //     //? 유저 DB에 리프레시 토큰 없음. 발생하면 안되는 에러
      //     userInfo.error = "invalid";
      //     return userInfo;
      //   }

      //   let newGoogleToken;
      //   try {
      //     newGoogleToken = await axios.post(googleTokenUrl, {
      //       client_id: process.env.GOOGLE_CLIENT_ID,
      //       client_secret: process.env.GOOGLE_CLIENT_SECRET,
      //       refresh_token: googleRefreshToken,
      //       grant_type: "refresh_token",
      //       redirect_uri: process.env.CLIENT_REDIRECT_URL,
      //     });
      //   } catch (error) {
      //     logger(`소셜 로그인 - 토큰 교환 실패. 유효하지 않은 refresh token`);
      //     // 유저 DB의 리프레시 토큰 삭제.
      //     // 사용자의 재로그인 요청
      //     await googleUserInfo.update({ refreshToken: null });
      //     console.error(error.response.data);
      //     userInfo.error = "invalid";
      //     return userInfo;
      //   }

      //   const { access_token: newAccessToken } = newGoogleToken.data;
      //   logger("소셜 로그인 - 액세스 토큰 재발급 완료: ", newGoogleToken.data);

      //   userInfo.accessToken = newAccessToken;
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
