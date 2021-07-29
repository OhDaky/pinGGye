import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import Nav from "../components/Nav";
import Footer from "../components/Footer";

import "./Styles/Mypage.css";

export default function Mypage({ user }) {
  // ? ###### Default Value ######
  let pinGGyeURL = process.env.REACT_APP_API_URL;
  let accessToken = localStorage.getItem("accessToken");

  // ? ###### 메인 페이지로 redirect ######
  const history = useHistory();

  // ? ###### 에러 메세지 state ######
  const [existError, setExistError] = useState("");
  const resetErrorMsg = () => {
    setExistError("");
  };

  // ? ###### 유저정보 state ######
  const [userInfo, setUserInfo] = useState({
    email: user.email,
    nickname: user.nickname,
    password: "",
  });
  const handleInputValue = (key) => (e) => {
    setUserInfo({ ...userInfo, [key]: e.target.value });
  };

  // ? ###### 회원 정보 수정 handler ######
  const { nickname, password } = userInfo;
  const handleUserInfo = () => {
    if (!nickname) setExistError("닉네임을 입력해주세요");
    else if (!password) setExistError("비밀번호를 입력해주세요");
    if (nickname && password) {
      axios({
        method: "patch",
        url: `${pinGGyeURL}/users/mypage`,
        data: { nickname, password },
        headers: {
          authorization: `Bearer ${accessToken}`,
          logintype: localStorage.getItem("loginType"),
        },
      })
        .then(() => {
          history.push("/");
          alert("회원정보가 수정되었습니다.");
          resetErrorMsg();
        })
        .catch((err) => alert(err));
    }
  };

  return (
    <>
      <Nav />
      <div className="main">
        <div className="mypage">
          <div className="mypage-title"> Mypage </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div>
              <div>Email</div>
              <input
                className="mypage-inputbox"
                type="email"
                value={userInfo.email}
                readOnly
              />
            </div>
            <div>
              <div>Nickname</div>
              <input
                className="mypage-inputbox"
                type="text"
                value={userInfo.nickname}
                onChange={handleInputValue("nickname")}
              />
            </div>
            <div>
              <div>Password</div>
              <input
                className="mypage-inputbox"
                type="password"
                onChange={handleInputValue("password")}
              />
            </div>
            <button className="mypage__btn" onClick={() => handleUserInfo()}>
              회원 정보 수정
            </button>
            <div className="mypage__alert-box">{existError}</div>
          </form>
        </div>
      </div>
      <Footer className="footer" />
    </>
  );
}
