const getUserInfo = require("./getUserInfo");

const authUser = async (req, res, next) => {
  const { authorization, loginType } = req.headers;
  if (!authorization) {
    // 액세스 토큰 없음
    return res.status(403).json({ message: "Token does not exist" });
  } 
  if (!loginType) {
    // 요청에 로그인 타입 없음
    return res.status(403).json({ message: "Type does not exist" });
  }
  
  const accessToken = authorization.split(" ")[1];

  const userInfo = await getUserInfo(accessToken, loginType);

  const { userId, email } = userInfo;
  if (!userId || !email) {
    // 토큰 검증은 되었지만 올바른 데이터가 들어있지 않음
    return res.status(403).json({ message: "Invalid token" });
  }

  req.userInfo = userInfo; // 요청 객체에 유저 정보 입력
  next();
};

module.exports = authUser;
