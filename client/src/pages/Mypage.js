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
  const [existError, setExistError] = useState("");
  // const [nicknameError, setNicknameError] = useState("");
  // const [passwordError, setPasswordError] = useState("");
  const resetErrorMsg = () => {
    // setNicknameError("");
    // setPasswordError("");
    setExistError("");
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
  const { nickname, password } = userInfo;
  const handleUserInfo = () => {
    if (!nickname) setExistError("닉네임을 입력해주세요")
    else if (!password) setExistError("비밀번호를 입력해주세요");
    if (nickname && password) {
      console.log('수정버튼클릭');
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
          console.log('수정 완료');
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
              <div>이메일</div>
              <input
                className="inputbox"
                type="email"
                value={userInfo.email}
                readOnly
                />
            </div>
            <div>
              <div>닉네임</div>
              <input
                className="inputbox"
                type="text"
                // placeholder="Nickname"
                value={userInfo.nickname}
                onChange={handleInputValue("nickname")}
              />
              {/* <div className="mypage__alert-box">{nicknameError}</div> */}
            </div>
            <div>
              <div>비밀번호</div>
              <input
                className="inputbox"
                type="password"
                // placeholder="Password"
                onChange={handleInputValue("password")}
              />
              {/* <div className="mypage__alert-box">{passwordError}</div> */}
              </div>
            <button className="mypage__btn" onClick={() => handleUserInfo()}>회원 정보 수정</button>
            <div className="mypage__alert-box">{existError}</div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
