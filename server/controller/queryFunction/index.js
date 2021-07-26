module.exports = {
  // 조회 쿼리
  findAllFeeds: require("./findAllFeeds"),
  findAllTags: require("./findAllTags"),
  findFeed: require("./findFeed"),
  findFeedComments: require("./findFeedComments"),
  findAllLikeFeeds: require("./findAllLikeFeeds"),
  // 생성 쿼리
  createUserData: require("./createUserData"),
  createFeedData: require("./createFeedData"),
  createFeedCommentData: require("./createFeedCommentData"),
  createLikeFeedData: require("./createLikeFeedData"),
};
