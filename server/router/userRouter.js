const controller = require("../controller");
const express = require("express");
const userRouter = express.Router();

// 마이페이지 - 회원 정보 조회  /users/status
// userRouter.get("/status", controller);
// 마이페이지 - 회원 정보 수정
// userRouter.patch("/status", controller);

// 회원가입
userRouter.post('/signup', controller.signup)

// 로그인 
userRouter.post('/login', controller.login)

// 로그아웃
userRouter.post('/logout', controller.logout)

module.exports = userRouter;
