import controller from "../controller/index";
import express from "express";
const userRouter = express.Router();

// 마이페이지 - 회원 정보 조회  /users/status
userRouter.get("/users/status", controller);
// 마이페이지 - 회원 정보 수정
userRouter.patch("/users/status", controller);

export default userRouter;
