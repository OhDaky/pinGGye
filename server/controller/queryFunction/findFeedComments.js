const { User: UserModel, FeedComment: FeedCommentModel } = require("../../models");

module.exports = async (feedId) => {
  const comment = await FeedCommentModel.findAll({ attributes: ["id", "feedId", "textContent", "createdAt", "updatedAt"], where: { feedId: feedId }, include: [{ model: UserModel }] });
  
  const result = comment.map((comment) => {
    comment.dataValues.nickname = comment.dataValues.User.nickname;
    comment.dataValues.email = comment.dataValues.User.email;
    delete comment.dataValues.User;
    return comment.dataValues;
  })
  
  return result;
};
