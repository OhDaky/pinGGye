const db = require("../controller/queryFunction");
const dummy = require("./dummyList");
const { sequelize } = require("../models");
const logger = require("../utils/logger");

const IMG_SERVER = process.env.DUMMY_IMAGE_SERVER;

const generateRandomNum = (min, max) => {
  const num = Math.floor((Math.random() * (max - min + 1)) + min);
  // console.log(num);
  return num;
}

const truncateAll = async () => {
    logger("모든 테이블 초기화 시작");
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0", null);
    await sequelize.truncate({ cascade: true });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", null);
    logger("모든 테이블 초기화 완료");
};

const createDummy = async () => {
  const ADMIN_PW = process.env.DUMMY_ADMIN_PW;
  const USER_PW = process.env.DUMMY_USER_PW;
  const dummyUsersInfo = dummy.users;
  const dummyFeedsInfo = dummy.feeds;
  const dummyCommentsInfo = dummy.comments;

  //! DB 테이블 초기화
  await truncateAll();
  console.log("Dummy data 생성 시작");
  
  //! 유저 생성
  //* createUserData(email, password, nickname, signUpType?, accountType?);
  const userInfoArr = [];

  //? 어드민 유저 입력
  const userAdmin = await db.createUserData(
    "admin@mail.com",
    ADMIN_PW,
    "관리자",
    "email",
    "admin"
  );
  userInfoArr.push(userAdmin);

  //? 일반 유저 입력
  for (let user of dummyUsersInfo) {
    const userInfo = await db.createUserData(
      `${user[0]}@mail.com`,
      USER_PW,
      user[1]
    );
    userInfoArr.push(userInfo);
  }
  const lastUserIdx = userInfoArr.length - 1;


  //! 피드 생성
  //* createFeedData(userId, subject, imageSrc, thumbnailSrc, tagsText)
  // 랜덤한 유저가 피드 작성
  
  const feedInfoArr = [];
  for (let feed of dummyFeedsInfo) {
    const userIdx = generateRandomNum(2, lastUserIdx); // 관리자, kim을 제외한 유저
    const feedInfo = await db.createFeedData(userInfoArr[userIdx].id, feed[0], `${IMG_SERVER}/${feed[1]}`, `${IMG_SERVER}/${feed[2]}`, feed[3]);

    feedInfoArr.push(feedInfo);
  }
  const lastFeedIdx = feedInfoArr.length - 1;


  // ! 피드 댓글 생성
  // * createFeedCommentData(feedId, userId, textContent)
  // 랜덤한 유저가 자신이 작성한 피드를 제외한 피드에 댓글 작성

  const lastCommnetIdx = dummyCommentsInfo.length - 1;

  for (let i = 1; i <= 100; i++) {
    const userIdx = generateRandomNum(2, lastUserIdx);
    const feedIdx = generateRandomNum(0, lastFeedIdx);
    const commIdx = generateRandomNum(0, lastCommnetIdx);

    if (feedInfoArr[feedIdx].userId === userInfoArr[userIdx].id) continue;

    await db.createFeedCommentData(feedInfoArr[feedIdx].id, userInfoArr[userIdx].id, dummyCommentsInfo[commIdx]);    
  }

  
  //! 피드 좋아요 생성
  //* createLikeFeedData(userId, feedId)
  // 랜덤한 유저가 자신이 작성한 피드를 제외한 피드에 좋아요(다운)

  for (let userIdx = 2; userIdx <= lastUserIdx; userIdx++) {
    if (userIdx !== lastUserIdx) {
      await db.createLikeFeedData(userInfoArr[userIdx].id, feedInfoArr[lastFeedIdx - 4].id);
      await db.createLikeFeedData(userInfoArr[userIdx].id, feedInfoArr[lastFeedIdx - 3].id);
      await db.createLikeFeedData(userInfoArr[userIdx].id, feedInfoArr[lastFeedIdx - 2].id);
    }
    await db.createLikeFeedData(userInfoArr[userIdx].id, feedInfoArr[lastFeedIdx - 1].id);
    await db.createLikeFeedData(userInfoArr[userIdx].id, feedInfoArr[lastFeedIdx].id);
  }

  for (let i = 1; i <= 100; i++){
    const userIdx = generateRandomNum(2, lastUserIdx);
    const feedIdx = generateRandomNum(0, lastFeedIdx - 5);

    await db.createLikeFeedData(userInfoArr[userIdx].id, feedInfoArr[feedIdx].id);
  }
  
  console.log("Dummy data 생성 완료");
};

module.exports = createDummy;
