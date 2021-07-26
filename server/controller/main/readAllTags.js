const db = require("../queryFunction");

const readAllTags = async (req, res) => {
  try {
    const tags = await db.findAllTags();

    res.status(200).json({ data: { tags }, message: "All tags successfully read" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to read all tags" });
  }
}

module.exports = readAllTags;