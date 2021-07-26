const { User: UserModel } = require("../../models");
const crypto = require("crypto");
const axios = require("axios");

const googleTokenUrl = "https://oauth2.googleapis.com/token";
const googleProfileUrl = "https://www.googleapis.com/oauth2/v3/userinfo";

module.exports = async (req, res) => {
  const { authorizationCode } = req.body;

  if (!authorizationCode) {
    return res
      .status(400)
      .json({ message: "Authorization code does not exist" });
  }

  //* authorization code로 access token 교환
  let googleToken;
  try {
    googleToken = await axios.post(googleTokenUrl, {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code: authorizationCode,
      grant_type: "authorization_code",
      redirect_uri: process.env.CLIENT_REDIRECT_URL,
    });
  } catch (error) {
    console.error(error.response.data);
    return res.status(400).json({ message: "Invalid authorization code" });
  }

  const { access_token: accessToken } = googleToken.data;
  console.log("Google 유저 Token", googleToken.data);

  //* access token으로 유저 정보 획득
  let googleUserInfo;
  try {
    googleUserInfo = await axios.get(googleProfileUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (error) {
    console.error(error.response.data);
    return res.status(400).json({ message: "Invalid access token" });
  }

  const { name: nickname, email } = googleUserInfo.data;
  console.log("Google 유저 정보", googleUserInfo.data);

  //* 유저 DB 조회 또는 생성
  try {
    const userInfo = await UserModel.findOne({ where: { email: email } });

    if (userInfo) {
      // 유저 정보 DB에 존재
      if (userInfo.signUpType === "email") {
        //이미 기존 회원가입으로 가입한 유저
        return res.status(409).json({ message: "You already sign up" });
      } else if (userInfo.signUpType === "google") {
        // 로그인 성공

        delete userInfo.dataValues.id;
        delete userInfo.dataValues.password;
        return res
          .status(200)
          .json({ data: { accessToken, userInfo }, message: "Login succeed" });
      }
    } else {
      // 유저 정보 없음 -> 회원 가입 및 로그인
      const password = Math.random().toString(18).slice(2); // 숫자와 영어로 된 랜덤한 16자리 비밀번호 생성
      console.log(password);
      const salt = process.env.PASSWORD_SALT;
      const hashedPassword = crypto
        .createHash("sha512")
        .update(password + salt)
        .digest("hex");

      const newUserInfo = await UserModel.create({
        email: email,
        password: hashedPassword,
        nickname: nickname,
        signUpType: "google",
        accountType: "user",
      });

      delete newUserInfo.dataValues.id;
      delete newUserInfo.dataValues.password;
      return res.status(201).json({
        data: { accessToken, userInfo: newUserInfo },
        message: "User registration completed, Login succeed",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
