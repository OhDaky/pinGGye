const db = require("../queryFunction");

module.exports = async (req, res) => {
  const { limit, order } = req.query;

  try {
    const tags = await db.findAllTags(limit, order);

    res
      .status(200)
      .json({ data: { tags }, message: "All tags successfully read" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to read all tags" });
  }
};
