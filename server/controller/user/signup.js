const jwt = require("jsonwebtoken");

module.export = (req, res) => {
  const { email, password, nickname } = req.body;

  if (!email || !password || !nickname) {
    return res.status(422).send("insufficient parameters supplied");
  }

  user.findOrCreate({
    where: {
      email,
    },
    defaults: {
      password,
      nickname,
    },
  });
};
