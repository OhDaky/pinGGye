const logger = require("../utils/logger");
const getUserInfo = require("./getUserInfo");

const authUser = async (req, res, next) => {
  const { authorization, logintype: loginType } = req.headers;

  if (!authorization) {
    // 액세스 토큰 없음
    return res.status(401).json({ message: "Token does not exist" });
  }
  if (!loginType) {
    // 요청에 로그인 타입 없음
    return res.status(401).json({ message: "Type does not exist" });
  }

  const accessToken = authorization.split(" ")[1];

  const userInfo = await getUserInfo(accessToken, loginType);
  logger('사용자 토큰 검증', userInfo);
  if (userInfo.error === "expired") {
    //* 리프레시 토큰 사용 가능
    return res.status(403).json({ message: "Expired token" });
  } else if (userInfo.error === "invalid") {
    return res.status(403).json({ message: "Invalid token" });
  }

  const { userId, email, accountType } = userInfo;
  if (!userId || !email || !accountType) {
    // 토큰 검증은 되었지만 올바른 데이터가 들어있지 않음
    return res.status(403).json({ message: "Invalid token" });
  }

  req.userInfo = userInfo; // 요청 객체에 유저 정보 입력
  next();
};

module.exports = authUser;
