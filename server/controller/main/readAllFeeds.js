const db = require("../queryFunction");

const readAllFeeds = async (req, res) => {
  try {
    const feeds = await db.findAllFeeds();

    res
      .status(200)
      .json({ data: { feeds }, message: "All feeds successfully read" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to read all feeds" });
  }
};

module.exports = readAllFeeds;
