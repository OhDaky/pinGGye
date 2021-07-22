const { Feed: FeedModel, Tag: TagModel, User: UserModel, FeedComment: FCModel } = require("./models");

//! 유저 회원가입
const usercreate = async () => {
  // email과 type을 이용한 조건 검사 필요
  await UserModel.create({ email: "kim@mail.com", nickname: "김", password: "1234", type: "email" });
}
// usercreate();

//! 피드 업로드
const insert = async (user, feed) => {
  const userInfo = await UserModel.findOne({ where: { email: user.email } });

  const feedInfo = await FeedModel.create({
    userId: userInfo.id,
    subject: feed.subject,
    image: "이미지",    // 이미지 및 섬네일은 multerS3 연동하여 가져옴
    thumbnail: "섬넬",
    download: 0
  });

  await addTagRows(feed.tags).then((result) => {
    result.forEach((el) => {
      feedInfo.addTags(el[0]);
    })
  });

  async function addTagRows(tags) {
    return await Promise.all(
      tags.map(addTag)
    );
  }
  async function addTag(name) {
    return TagModel.findOrCreate({
      where: { name }
    });
  }
}

const user = { email: "kim@mail.com" }
const feed = { subject: "으악", tags: ["3차", "술자리", "회식"] };

// insert(user,feed)

//! 피드 조회
const findAll = async () => {
  const result = await FeedModel.findAll({ attributes: ["id", "subject", "image", "thumbnail", "download", "createdAt", "updatedAt"], include: [{ model: TagModel, required: false, through: { attributes: [] } }, {model: UserModel}] });
  
  const formatted = result.map((feed) => {
    feed.dataValues.Tags = feed.dataValues.Tags.map((tag) => tag.name);
    feed.dataValues.nickname = feed.dataValues.User.nickname;
    feed.dataValues.User = feed.dataValues.User.email;
    return feed.dataValues;
  })
  console.log(formatted);
}

// findAll();

//! 피드 태그로 조회 -> 클라이언트에서 필터링
const findFeedFilter = async (tag) => {
  const result = await FeedModel.findAll({ attributes: ["id", "subject", "image", "thumbnail", "download", "createdAt", "updatedAt"], include: [{ model: TagModel, required: false, through: { attributes: [] } }, {model: UserModel}] });
  
  const formatted = result.map((feed) => {
    feed.dataValues.Tags = feed.dataValues.Tags.map((tag) => tag.name);
    feed.dataValues.nickname = feed.dataValues.User.nickname;
    feed.dataValues.User = feed.dataValues.User.email;
    return feed.dataValues;
  })

  //* 필터링 -> 클라이언트 단에서 처리
  const filtered = formatted.filter((feed) => feed.Tags.includes(tag));
  console.log(filtered)
}

// findFeedFilter("술자리");


//! 피드 댓글 저장
const createFeedComment = async (feedId, user, comment) => {
  const userInfo = await UserModel.findOne({ where: { email: user.email } });

  await FeedModel.findOne({
    where: {
      id: feedId
    }
  }).then((result) => {
    if (result) { // 해당 피드가 존재하면
      FCModel.create({ feedId: feedId, userId: userInfo.id, textContent: comment });
    }
  });
}

//* 토큰에 id가 있다면 email 대신 바로 userId로 입력 가능!
// createFeedComment(5, { email: "kim@mail.com" }, "5번이네요");

//! 피드 댓글 조회
const findFeedComment = async (feedId) => {
  const comment = await FCModel.findAll({ attributes: ["id", "feedId", "textContent", "createdAt"], where: { feedId: feedId }, include: [{ model: UserModel }] });
  
  const formatted = comment.map((comment) => {
    comment.dataValues.nickname = comment.dataValues.User.nickname;
    comment.dataValues.User = comment.dataValues.User.email;
    return comment.dataValues;
  })
  console.log(formatted);
}

findFeedComment(5);