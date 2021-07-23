module.exports = (req, res) => {
  // res.cookie("jwt", "", {
  //   httpOnly: true,
  // });
  res.status(205).json({ message: "Logged out succeed" });
};
