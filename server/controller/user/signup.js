const db = require("../queryFunction");

module.exports = async (req, res) => {
  const { email, password, nickname } = req.body;

  if (!email || !password || !nickname) {
    // console.log(req.body);
    return res.status(422).send("insufficient parameters supplied");
  }

  try {
    const result = await db.createUserData(
      email,
      password,
      nickname,
      "email",
      "user"
    );

    if (result.error) {
      res.status(409).json({ message: "Email already exists" });
    } else {
      res.status(201).json({ message: "User registration completed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "User registration failed" });
  }
};
