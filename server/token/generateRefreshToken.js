const { Feed: FeedModel, Tag: TagModel, User: UserModel, FeedComment: FCModel } = require("../../models");
const jwt = require('jsonwebtoken')

const generateRefreshToken = async (id, email) => {
  return jwt.sign({
    userId: id,
    email,
  },
    process.env.REFRESH_SECRET,
    { expiresIn: "30d" }
  );
}

module.exports = generateRefreshToken
