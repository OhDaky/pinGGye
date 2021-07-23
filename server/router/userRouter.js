const controller = require("../controller");
const express = require("express");
const userRouter = express.Router();

// 마이페이지 - 회원 정보 조회  
userRouter.get("/mypage", controller);
// 마이페이지 - 회원 정보 수정
userRouter.patch("/mypage", controller);

// 회원가입
userRouter.post('/signup', controller.signup)

// 로그인 
userRouter.post('/login', controller.login)

// 로그아웃
userRouter.post('/logout', controller.logout)

module.exports = userRouter;
