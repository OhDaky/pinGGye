import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Styles/Mypage.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import axios from "axios";

// TODO : Home에서 user.email, nickname을 props로 받아와서 state로 저장
export default function Mypage({ user }) {
  // ? ###### Default Value ######
  let pinGGyeURL = process.env.REACT_APP_API_URL;
  let accessToken = localStorage.getItem("accessToken");

  // ? ###### 메인 페이지로 redirect ######
  const history = useHistory();

  // ? ###### 에러 메세지 state ######
  const [nicknameError, setNicknameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const resetErrorMsg = () => {
    setNicknameError("");
    setPasswordError("");
  };

  // ? ###### 유저정보 state ######
  const [userInfo, setUserInfo] = useState({
    email: user.email, // Home에서 받아온 데이터 입력
    nickname: user.nickname, // Home에서 받아온 데이터 입력
    password: "",
  });
  const handleInputValue = (key) => (e) => {
    setUserInfo({ ...userInfo, [key]: e.target.value });
  };

  // ? ###### 회원 정보 수정 handler ######
  const handleUserInfo = () => {
    resetErrorMsg();
    const { nickname, password } = userInfo;
    if (!nickname) setNicknameError("닉네임을 입력해주세요");
    else if (!password) setPasswordError("비밀번호를 입력해주세요");
    else {
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
        })
        .catch((err) => alert(err));
    }
  };

  return (
    <>
      <Nav />
      <div className="main">
        <div className="mypage">
          <div className="mypage__message">마이 페이지</div>
          <input
            className="input__email"
            type="email"
            value={userInfo.email}
            readOnly
          />
          <input
            className="input__nickname"
            type="text"
            placeholder="Nickname"
            value={userInfo.nickname}
            onChange={handleInputValue("nickname")}
          />
          <div className="signup__alert-box">{nicknameError}</div>
          <input
            className="input__password"
            type="password"
            placeholder="Password"
            onChange={handleInputValue("password")}
          />
          <div className="signup__alert-box">{passwordError}</div>
          <button onClick={handleUserInfo} className="mypage__btn">
            회원 정보 수정
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
