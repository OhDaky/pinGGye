import controller from "../controller/index";
import express from "express";
const mainRouter = express.Router();

// 피드 데이터 읽기 (조회)  /mains/feed
mainRouter.get("/mains/feed", controller);
// 해시태그 가져오기 (조회) /mains/hashtag
mainRouter.get("/mains/hashtag", controller);

export default mainRouter;
