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
  };

  return (
    <div className="login__container">
    <div className="login__img-box">로그인 페이지 이미지</div>
    <div className="login__login-box">
      <div className="login__container-title">Login</div>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="login__input-email">
          <div>이메일</div>
          <input type="email" onChange={handleInputValue("email")}></input>
        </div>
        <div className="login__input-password">
          <div>비밀번호</div>
          <input type="password" onChange={handleInputValue("password")}/>
        </div>
        <div>
          <button className="login__btn-login" type="submit" onClick={handleLogin}>
            로그인
          </button>
        </div>
        <div>
          <button className="login__btn-signup"><Link to="/signup">회원가입</Link></button>
        </div>
        <div className="login__alert-box">{errorMessage}</div>
      </form>
      </div>
    </div>
  );
}
  
