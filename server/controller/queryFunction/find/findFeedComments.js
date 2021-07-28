const {
  User: UserModel,
  FeedComment: FeedCommentModel,
} = require("../../../models");

module.exports = async (feedId, order) => {
  if (typeof order === "string") order = order.toUpperCase();
  if (order !== "ASC" && order !== "DESC") order = "ASC";

  const comment = await FeedCommentModel.findAll({
    attributes: ["id", "feedId", "textContent", "createdAt", "updatedAt"],
    where: { feedId: feedId },
    include: [{ model: UserModel }],
    order: [["id", order]],
  });

  const result = comment.map((comment) => {
    comment.dataValues.nickname = comment.dataValues.User.nickname;
    comment.dataValues.email = comment.dataValues.User.email;
    delete comment.dataValues.User;
    return comment.dataValues;
  });

  return result;
};
