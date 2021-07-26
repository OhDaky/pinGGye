const db = require("../controller/queryFunction");
const imgServer = process.env.IMAGE_SERVER;

const createDummy = async () => {
  console.log("Dummy data 생성 시작");
  //! 유저 생성
  //* createUserData(email, password, nickname, signUpType, accountType);
  const userAdmin = await db.createUserData("admin@mail.com", "admin9999", "관리자", "email", "admin");
  if (userAdmin.error === "exist") {
    console.log("Dummy data 존재, 종료");
    return; // 관리자 계정 존재 시, 더미 입력 금지
  }
  const userJung = await db.createUserData("jung@mail.com", "1234", "정양", "email", "user");
  const userLee = await db.createUserData("lee@mail.com", "1234", "이군", "email", "user");

  //! 피드 생성 
  //* createFeedData(userId, subject, imageSrc, thumbnailSrc, tagsText);
  // await db.createFeedData(2, "사진 입니다", `${imgServer}/1627046248577.jpeg`, `${imgServer}/1627046248577t.jpeg`, "가,나,다");
  // const feed2 = await db.createFeedData(userLee.id, "사진 입니다", `${imgServer}/1627046248577.jpeg`, `${imgServer}/1627046248577t.jpeg`, "하나,둘,셋");


  //! 피드 댓글 생성
  //* createFeedCommentData(feedId, userId, textContent)
  // await db.createFeedCommentData(10, 2, "퍼가요~~~~")
  // await db.createFeedCommentData(feed2.id, userLee.id, "더미입력");

  //! 피드 좋아요 생성
  //* createLikeFeedData(userId, feedId)
  // await db.createLikeFeedData(2, 10);
  // await db.createLikeFeedData(userLee.id, feed2.id);


  console.log("Dummy data 생성 완료");
};

module.exports = createDummy;
