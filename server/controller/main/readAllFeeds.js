const { Feed: FeedModel, Tag: TagModel, User: UserModel} = require("../../models");

const readAllFeeds= async () => {
  const result = await FeedModel.findAll({ attributes: ["id", "subject", "image", "thumbnail", "download", "createdAt", "updatedAt"], include: [{ model: TagModel, required: false, through: { attributes: [] } }, {model: UserModel}] });
  
  const formatted = result.map((feed) => {
    feed.dataValues.Tags = feed.dataValues.Tags.map((tag) => tag.name);
    feed.dataValues.nickname = feed.dataValues.User.nickname;
    feed.dataValues.User = feed.dataValues.User.email;
    return feed.dataValues;
  })
  return formatted;
}
  
module.exports =  readAllFeeds;