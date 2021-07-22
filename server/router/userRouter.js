const controller = require("../controller");
const express = require("express");
const userRouter = express.Router();

// 마이페이지 - 회원 정보 조회  /users/status
// userRouter.get("/status", controller);
// 마이페이지 - 회원 정보 수정
// userRouter.patch("/status", controller);

module.exports = userRouter;
