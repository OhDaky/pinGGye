module.exports = {  
  // 조회 쿼리 함수
  findAllFeeds: require("./find/findAllFeeds"),
  findAllTags: require("./find/findAllTags"),
  findFeed: require("./find/findFeed"),
  findFeedComments: require("./find/findFeedComments"),
  findAllLikeFeeds: require("./find/findAllLikeFeeds"),
  // 입력 쿼리 함수
  createUserData: require("./create/createUserData"),
  createFeedData: require("./create/createFeedData"),
  createFeedCommentData: require("./create/createFeedCommentData"),
  createLikeFeedData: require("./create/createLikeFeedData"),
};
