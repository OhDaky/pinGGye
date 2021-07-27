module.exports = {
  // 조회 쿼리
  findAllFeeds: require("./find/findAllFeeds"),
  findAllTags: require("./find/findAllTags"),
  findFeed: require("./find/findFeed"),
  findFeedComments: require("./find/findFeedComments"),
  findAllLikeFeeds: require("./find/findAllLikeFeeds"),
  // 생성 쿼리
  createUserData: require("./create/createUserData"),
  createFeedData: require("./create/createFeedData"),
  createFeedCommentData: require("./create/createFeedCommentData"),
  createLikeFeedData: require("./create/createLikeFeedData"),
};
