const controller = require("../controller");
const authUser = require("../middlewares/authUser");
const express = require("express");
const mainRouter = express.Router();

// 사용자 인증
mainRouter.use("/", authUser);

// 유저정보, 피드, 태그 읽기 /
mainRouter.get("/", controller.readAllData);

// 피드 데이터 읽기 (조회)  /feed
mainRouter.get("/feed", controller.readAllFeeds);

// 해시태그 가져오기 (조회) /hashtag
mainRouter.get("/tag", controller.readAllTags);

// 다운받은(북마크) 피드 데이터 읽기
mainRouter.get("/feed/like", controller.readAllLikeFeeds);

module.exports = mainRouter;
