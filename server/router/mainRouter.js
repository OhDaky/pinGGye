const controller = require("../controller");
const authUser = require("../middlewares/authUser");
const express = require("express");
const mainRouter = express.Router();

mainRouter.use("/", authUser);

// 피드 데이터 읽기 (조회)  /feed
mainRouter.get("/feed", controller.readAllFeeds);

// 해시태그 가져오기 (조회) /hashtag
mainRouter.get("/tag", controller.readAllTags);

// 다운받은(북마크) 피드 데이터 읽기
mainRouter.get("/feed/like", controller.readAllLikeFeeds);

module.exports =  mainRouter;
