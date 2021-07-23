const { Tag: TagModel, Feed: FeedModel } = require("../../models");
const db = require("../queryFunction");

const readAllTags = async (req, res) => {
  try {
    const tags = await db.findAllTags();

    res.status(200).json({ data: { tags: tags }, message: "Send all tags" });
  } catch (error) {
    return res.status(500).json({ data: null, message: "Server error" });
  }
}

module.exports = readAllTags;