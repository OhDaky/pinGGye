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

const truncateAll = async (value) => {
  if (value === "true") {
    logger("모든 테이블 초기화 시작");
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0", null);
    await sequelize.truncate({ cascade: true });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", null);
    logger("모든 테이블 초기화 완료");
  } else {
    logger("모든 테이블 초기화 비활성");
  }
};

const createDummy = async () => {
  const ADMIN_PW = process.env.DUMMY_ADMIN_PW;
  const USER_PW = process.env.DUMMY_USER_PW;
  //! DB 테이블 초기화
  await truncateAll(process.env.TRUNCATE_TABLE);

  const dummyUsersInfo = dummy.users;
  const dummyFeedsInfo = dummy.feeds;
  const dummyCommentsInfo = dummy.comments;

  console.log("Dummy data 생성 시작");
  //! 유저 생성
  const userInfoArr = [];

  //* createUserData(email, password, nickname, signUpType?, accountType?);
  //? 어드민 유저 입력
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
  const feedInfoArr = []; // 관리자 제외
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

    await db.createFeedCommentData(feedInfoArr[feedIdx].id, userInfoArr[userIdx].id, dummyCommentsInfo[commIdx]);    
  }

  
  //! 피드 좋아요 생성
  //* createLikeFeedData(userId, feedId)
  // 랜덤한 유저가 자신이 작성한 피드를 제외한 피드에 좋아요 꾹

  // 46~48번째 피드 좋아요 9. 49~50 피드 좋아요 10
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
