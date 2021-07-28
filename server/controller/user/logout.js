module.exports = (req, res) => {
  // res.cookie("jwt", "", {
  //   httpOnly: true,
  // });
  //? 리프레시 토큰 + 쿠키 방법을 사용하지 않으면 불필요
  res.status(205).json({ message: "Logged out succeed" });
};
