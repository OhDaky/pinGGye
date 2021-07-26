const { User: UserModel } = require("../../models");

// 유저 정보 수정
// 클라이언트로부터 PATCH 요청을 받는다 (payload: 수정된 이메일 or 수정된 닉네임, 토큰)
// 요청에 있는 유저 아이디과 일치하는 유저 아이디를 DB에서 찾는다.
// 수정할 유저 정보를 DB에 저장한다 (nickname)
// 수정된 유저 정보를 응답으로 보낸다.

module.exports = async (req, res) => {
  const { nickname } = req.body;
  const { id } = req.userInfo;

  const result = await UserModel.findOne({ where: id });
  result.nickname = nickname;

  if (!result) {
    return res.status(404).json({ message: "User not found" })
  }
  return res.status(201).json({ data: {result} , message: "Successfully updated userinfo"});
}