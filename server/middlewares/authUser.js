const logger = require("../utils/logger");
const getUserInfo = require("./getUserInfo");

const authUser = async (req, res, next) => {
  const { authorization, logintype: loginType } = req.headers;

  if (!authorization) {
    // 액세스 토큰 없음
    logger("유저 토큰 검증 - 인증 헤더 없음");
    return res.status(401).json({ message: "Token does not exist" });
  }
  if (!loginType) {
    // 요청에 로그인 타입 없음
    logger("유저 토큰 검증 - 로그인 타입 헤더 없음");
    return res.status(401).json({ message: "Type does not exist" });
  }

  const accessToken = authorization.split("Bearer ")[1];

  // const { refreshToken } = req.cookies;
  
  const userInfo = await getUserInfo(accessToken, loginType);
  // logger("유저 토큰 검증 - 유저 정보:", userInfo);
  if (userInfo.error === "expired") {
    //* 리프레시 토큰 사용 가능
    logger("유저 토큰 검증 - 만료된 토큰");
    return res.status(403).json({ message: "Expired token" });
  } else if (userInfo.error === "invalid") {
    logger("유저 토큰 검증 - 유효하지 않은 토큰");
    return res.status(403).json({ message: "Invalid token" });
  } else if (userInfo.error === "error") {
    logger("유저 토큰 검증 - 서버 오류");
    return res.status(500).json({ message: "Server error" });
  }

  const { userId, email, accountType } = userInfo;
  if (!userId || !email || !accountType) {
    // 토큰 검증은 되었지만 올바른 데이터가 들어있지 않음
    logger("유저 토큰 검증 - 잘못된 토큰");
    return res.status(403).json({ message: "Invalid token" });
  }

  // if (userInfo.accessToken) {
  //   logger("유저 토큰 검증 - 재발급 완료: ", userInfo);
  //   res.write({ accessToken });    // 헤더에 담아서 보낸다?
  // } else {
  // }
  
  logger("유저 토큰 검증 - 검증 완료: ", userInfo);
  req.userInfo = userInfo; // 요청 객체에 유저 정보 입력
  next();
};

module.exports = authUser;
