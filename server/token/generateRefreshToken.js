const { Feed: FeedModel, Tag: TagModel, User: UserModel, FeedComment: FCModel } = require("../../models");
const jwt = require('jsonwebtoken')

const generateRefreshToken = async (userInfo) => {
  return jwt.sign({
    userId: userInfo.id,
    email: userInfo.email,
    accountType: userInfo.accountType,
  },
    process.env.REFRESH_SECRET,
    { expiresIn: "30d" }
  );
}

module.exports = generateRefreshToken
