module.exports = {
  // user
  auth: require("./user/login"),
  login: require("./user/login"),
  loginGoogle: require("./user/loginGoogle"),
  logout: require("./user/logout"),
  signup: require("./user/signup"),
  updateUserInfo: require("./user/updateUserInfo"),

  // feed
  createFeed: require("./feed/createFeed"),
  updateFeed: require("./feed/updateFeed"),
  deleteFeed: require("./feed/deleteFeed"),

  // feed egg
  updateFeedEgg: require("./feed/updateFeedEgg"),

  // feed comment
  createFeedComment: require("./feed/createFeedComment"),
  reedFeedComment: require("./feed/readFeedComment"),
  updateFeedComment: require("./feed/updateFeedComment"),
  deleteFeedComment: require("./feed/deleteFeedComment"),

  // main
  readAllData: require("./main/readAllData"),
  readAllFeeds: require("./main/readAllFeeds"),
  readAllTags: require("./main/readAllTags"),
  readAllLikeFeeds: require("./main/readAllLikeFeeds"),
};
