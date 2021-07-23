const { Tag: TagModel } = require("../../models");

const readAllTags = async (tag) => {
  const result = await TagModel.findAll();
  console.log('모든 태그 조회', result);
}

module.exports = readAllTags;