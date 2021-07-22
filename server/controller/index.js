module.exports = {
  // user
  auth: require("./user/login"),
  login: require("./user/login"),
  logout: require("./user/logout"),
  signup: require("./user/signup"),

  // feed
  createFeed: require("./feed/createFeed"),
  readFeed: require("./feed/readFeed"),
  updateFeed: require("./feed/updateFeed"),
  deleteFeed: require("./feed/deleteFeed"),
  // feed egg
  readFeedEgg: require("./feed/readFeedEgg"),
  updateFeedEgg: require("./feed/updateFeedEgg"),
  // feed comment
  createFeedComment: require("./feed/createFeedComment"),
  reedFeedComment: require("./feed/readFeedComment"),
  updateFeedComment: require("./feed/updateFeedComment"),
  deleteFeedComment: require("./feed/deleteFeedComment")
};
