import controller from "../controller/index";
import express from "express";
const feedRouter = express.Router();

// 피드 업로드 /feeds/upload
feedRouter.post("/feeds/upload", controller);

// 피드 수정 /feeds/:id
feedRouter.patch("/feeds/:id", controller);
// 피드 조회
feedRouter.get("/feeds/:id", controller);
// 피드 삭제
feedRouter.delete("/feeds/:id", controller);

// 알 카운트 조회 /feeds/:id/egg
feedRouter.get("/feeds/:id/egg", controller);
// 알 카운트 수정
feedRouter.patch("/feeds/:id/egg", controller);

// 댓글 조회  /feeds/:id/comment
feedRouter.get("/feeds/:id/comment", controller);
// 댓글 등록
feedRouter.post("/feeds/:id/comment", controller);
// 댓글 수정
feedRouter.patch("/feeds/:id/comment", controller);
// 댓글 삭제
feedRouter.delete("/feeds/:id/comment", controller);

export default feedRouter;
