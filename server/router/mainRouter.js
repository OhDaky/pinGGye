const controller = require("../controller");
const express = require("express");
const mainRouter = express.Router();

// 피드 데이터 읽기 (조회)  /main/feed
// mainRouter.get("/feed", controller);
// 해시태그 가져오기 (조회) /mains/hashtag
// mainRouter.get("/hashtag", controller);

module.exports = mainRouter;
