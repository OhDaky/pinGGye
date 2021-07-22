const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  const userInfo = await Users.findOne({
    where: { userId: req.body.userId, password: req.body.password },
  });
  // console.log(userInfo);

  if (!userInfo) {
    res.status(401).json({ data: null, message: "not authorized" });
  } else {
    delete userInfo.dataValues.password;

    const accessToken = jwt.sign(
      userInfo.dataValues,
      process.env.ACCESS_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      userInfo.dataValues,
      process.env.REFRESH_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("refreshToken", refreshToken, {
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({ data: { accessToken }, message: "ok" });
  }
};
