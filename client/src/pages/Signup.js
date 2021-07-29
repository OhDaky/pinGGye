import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { emailIsValid, pwIsValid } from "../utils/Validator";

import Footer from "../components/Footer";

import "./Styles/Signup.css";
import logo from "../static/images/pinGGyeLogo.png";

export default function Signup() {
  // ? ###### Default Value ######
  let pinGGyeURL = process.env.REACT_APP_API_URL;

  // ? ###### 로그인 페이지로 redirect ######
  const history = useHistory();

  // ? ###### 회원가입 정보 state ######
  const [signupInfo, setSignupInfo] = useState({
    email: "",
    nickname: "",
    password: "",
  });
  const handleInputValue = (key) => (e) => {
    setSignupInfo({ ...signupInfo, [key]: e.target.value });
  };

  // ? ###### 에러 메세지 state ######
  const [existError, setExistError] = useState("");
  const handleErrorMsg = () => {
    setExistError("");
  };

  // ? ###### 회원가입 handler ######
  const handleSignup = () => {
    const { email, nickname, password } = signupInfo;
    handleErrorMsg();
    if (!emailIsValid(email)) alert("이메일 형식을 맞춰주세요!");
    else if (!pwIsValid(password))
      alert("비밀번호는 8자이상 영어와 숫자로 이루어져야 합니다!");
    else {
      if (!email) setExistError("이메일을 입력하세요");
      else if (!nickname) setExistError("닉네임을 입력하세요");
      else if (!password) setExistError("비밀번호를 입력하세요");
      else {
        axios({
          method: "post",
          url: `${pinGGyeURL}/users/signup`,
          data: signupInfo,
        })
          .then(() => {
            alert(
              `${nickname}님 회원가입이 완료되었습니다! 최고의 핑계사진을 찾으러 가볼까요?`
            );
            history.push("/");
          })
          .catch(() => alert("이미 있는 회원입니다!"));
      }
    }
  };

  return (
    <>
      <div className="signup__container">
        <img className="signup__logo" src={logo} alt="logo" />
        <div className="signup__signup-box">
          <div className="signup__container-title">Sign up</div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="signup__input-email">
              <div>Email</div>
              <input
                className="signup__inputbox"
                type="email"
                onChange={handleInputValue("email")}
              />
            </div>
            <div className="signup__input-nickname">
              <div>Nickname</div>
              <input
                className="signup__inputbox"
                type="text"
                onChange={handleInputValue("nickname")}
              />
            </div>
            <div className="signup__input-password">
              <div>Password</div>
              <input
                className="signup__inputbox"
                type="password"
                onChange={handleInputValue("password")}
              />
            </div>
            <button
              className="signup__btn"
              onClick={() => handleSignup()}
              type="submit"
            >
              회원가입
            </button>
            <div className="signup__alert-box">{existError}</div>
          </form>
        </div>
      </div>
      <Footer className="footer" />
    </>
  );
}
