const db = require("../queryFunction");

module.exports = async (req, res) => {
  const { start, end, limit, order } = req.query;

  try {
    const feeds = await db.findAllFeeds(start, end, limit, order);

    res
      .status(200)
      .json({ data: { feeds }, message: "All feeds successfully read" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to read all feeds" });
  }
};
