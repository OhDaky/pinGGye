const { Tag: TagModel } = require("../../models");

const readAllTags = async (req, res) => {
  try {
    const tags = await TagModel.findAll();

    res.status(200).json({ data: { tags: tags }, message: "Send all tags" });

  } catch (error) {
    return res.status(500).json({ data: null, message: "Server error" });
  }
}

module.exports = readAllTags;