const db = require("../queryFunction");

const readAllFeeds = async (req, res) => {
  try {
    const feeds = await db.findAllFeeds();

    res
      .status(200)
      .json({ data: { feeds: feeds }, message: "Send all feeds" });
  } catch (error) {
    return res.status(500).json({ data: null, message: "Server error" });
  }
};

module.exports = readAllFeeds;
