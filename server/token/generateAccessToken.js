const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");
// dotenv.config();

const generateAccessToken = async (id, email) => {
  return jwt.sign({ userId: id, email: email }, process.env.ACCESS_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = generateAccessToken;