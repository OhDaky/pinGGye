const controller = require("../controller");
const authUser = require("../middlewares/authUser");
const upload = require("../middlewares/uploadImage");
const express = require("express");
const feedRouter = express.Router();

// 사용자 인증
feedRouter.use("/", authUser);


// 피드 업로드 /feeds/upload
feedRouter.post("/upload", upload.single("image"), controller.createFeed);

// 피드 조회
feedRouter.get("/:id", controller.readFeed);
// 피드 수정
feedRouter.patch("/:id", controller.updateFeed);
// 피드 삭제
feedRouter.delete("/:id", controller.deleteFeed);

// 알 카운트 수정
feedRouter.patch("/:id/egg", controller.updateFeedEgg);

// 댓글 등록  /feeds/:id/comment
feedRouter.post("/:id/comment", controller.createFeedComment);
// 댓글 조회
feedRouter.get("/:id/comment", controller.reedFeedComment);
// 댓글 수정
feedRouter.patch("/:id/comment", controller.updateFeedComment);
// 댓글 삭제
feedRouter.delete("/:id/comment", controller.deleteFeedComment);

module.exports = feedRouter;
