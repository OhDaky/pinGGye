const db = require("../controller/queryFunction");
const {
  User: UserModel,
  Feed: FeedModel,
  Tag: TagModel,
  FeedComment: FeedCommentModel,
  LikeFeed: LikeFeedModel,
} = require("../models");
const { sequelize } = require("../models");
const IMG_SERVER = process.env.DUMMY_IMAGE_SERVER;

const truncateAll = async () => {
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0", null);
  await LikeFeedModel.truncate();
  await FeedCommentModel.truncate();
  await FeedModel.truncate();
  await TagModel.truncate();
  await UserModel.truncate();
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", null);
};

const createDummy = async () => {
  const ADMIN_PW = process.env.DUMMY_ADMIN_PW;
  const USER_PW = process.env.DUMMY_USER_PW;
  // await truncateAll();

  // email id, nickname
  const dummyUsersInfo = [
    ["kim", "김군"],
    ["lee", "이군"],
    ["park", "박군"],
  ];

  // user id,
  const dummyFeedsInfo = [[]];

  console.log("Dummy data 생성 시작");
  //! 유저 생성
  //* createUserData(email, password, nickname, signUpType?, accountType?);
  const userAdmin = await db.createUserData(
    "admin@mail.com",
    ADMIN_PW,
    "관리자",
    "email",
    "admin"
  );
  if (userAdmin.error === "exist") {
    console.log("Dummy data 존재, 종료");
    return; // 관리자 계정 존재 시, 더미 입력 금지
  }

  const userInfoArr = [];
  for (let user of dummyUsersInfo) {
    const userInfo = await db.createUserData(
      `${user[0]}@mail.com`,
      USER_PW,
      user[1]
    );
    userInfoArr.push(userInfo);
  }
  // console.log(userInfoArr);

  //! 피드 생성
  //* createFeedData(userId, subject, imageSrc, thumbnailSrc, tagsText);
  // const feed2 = await db.createFeedData(userLee.id, "사진 입니다", `${IMG_SERVER}/1627046248577.jpeg`, `${IMG_SERVER}/1627046248577t.jpeg`, "하나,둘,셋");

  const feedInfoArr = [];
  // 랜덤한 유저가 임의의 피드를 생성

  //! 피드 댓글 생성
  //* createFeedCommentData(feedId, userId, textContent)
  // await db.createFeedCommentData(10, 2, "퍼가요~~~~")
  // await db.createFeedCommentData(feed2.id, userLee.id, "더미입력");
  // 랜덤한 유저가 자신이 작성한 피드를 제외한 피드에 댓글 작성
  // 최소값 ~ 최대값 중 선택하는 랜덤 함수 ( Math.random() * ( 최대값 - 최소값 )  ) + 최소값;

  // for (let i = 0; i < 40; i++) {
  //   const userIdx = Math.floor(Math.random() * (11 - 2) + 2); // 2~11
  //   const feedIdx = Math.floor(Math.random() * (41 - 1) + 1); // 1~40
  //   console.log(userIdx, feedIdx);

  //   // if (userInfoArr[userIdx].id === feedInfoArr[feedIdx].userId) continue;
  // }

  //! 피드 좋아요 생성
  //* createLikeFeedData(userId, feedId)
  // await db.createLikeFeedData(2, 10);
  // await db.createLikeFeedData(userLee.id, feed2.id);
  // 랜덤한 유저가 자신이 작성한 피드를 제외한 피드에 좋아요 꾹

  console.log("Dummy data 생성 완료");
};

module.exports = createDummy;
