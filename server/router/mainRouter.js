const controller = require("../controller");
const express = require("express");
const mainRouter = express.Router();

// 피드 데이터 읽기 (조회)  /feed
mainRouter.get("/feed", controller.readAllFeeds);

// 해시태그 가져오기 (조회) /hashtag
mainRouter.get("/tag", controller.readAllTags);

module.exports =  mainRouter;
