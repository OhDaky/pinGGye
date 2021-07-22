import axios from "axios";
import { Link } from "react-router-dom";
import React, { useState } from "react";

import "./Styles/Login.css"
  
export default function Login({ handleResponseSuccess }) {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const handleInputValue = (key) => (e) => {
    setLoginInfo({ ...loginInfo, [key]: e.target.value });
  }

  const handleLogin = () => {
    const { email, password } = loginInfo;
    if (!email && !password) {
      setErrorMessage('이메일과 비밀번호를 입력하세요');
      return;
    } else if (!email) {
      setErrorMessage('이메일을 입력하세요');
      return;
    } else if (!password) {
      setErrorMessage('비밀번호를 입력하세요');
    }
    axios
      .post('/login', loginInfo, {
        withCredentials: true,
      })
      .then((data) => {
        // 데이터 보내기
        handleResponseSuccess();
      })
  };

  return (
    <div id="container">
    <div id="imgBox">로그인 페이지 이미지</div>
    <div id="loginBox">
      <div id="title">Login</div>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="email">
          <div>이메일</div>
          <input type="email" onChange={handleInputValue("email")}></input>
        </div>
        <div className="password">
          <div>비밀번호</div>
          <input type="password" onChange={handleInputValue("password")}/>
        </div>
        <div>
          <button className="btn-login" type="submit" onClick={handleLogin}>
            로그인
          </button>
        </div>
        <div>
          <button className="btn-signup"><Link to="/signup">회원가입</Link></button>
        </div>
        <div id="alert-box">{errorMessage}</div>
      </form>
      </div>
    </div>
  );
}
  
