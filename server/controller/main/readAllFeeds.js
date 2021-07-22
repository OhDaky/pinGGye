
const { Feed: FeedModel, Tag: TagModel, User: UserModel, FeedComment: FCModel } = require("../../models");

const readAllFeeds= async () => {
  const result = await FeedModel.findAll({ attributes: ["id", "subject", "image", "thumbnail", "download", "createdAt", "updatedAt"], include: [{ model: TagModel, required: false, through: { attributes: [] } }, {model: UserModel}] });
  
  const formatted = result.map((feed) => {
    feed.dataValues.Tags = feed.dataValues.Tags.map((tag) => tag.name);
    feed.dataValues.nickname = feed.dataValues.User.nickname;
    feed.dataValues.User = feed.dataValues.User.email;
    return feed.dataValues;
  })
  console.log('모든 피드 조회');
  return formatted;
}
  
module.exports =  readAllFeeds;