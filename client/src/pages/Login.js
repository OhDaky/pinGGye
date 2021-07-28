import axios from "axios";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import logo from "../components/Styles/pinGGyeLogo.png";

import "./Styles/Login.css"  
export default function Login({ handleResponseSuccess, userInfo, setUserInfo, getHashtags }) {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  })
  const [errorMessage, setErrorMessage] = useState('');
  const handleInputValue = (key) => (e) => {
    setLoginInfo({ ...loginInfo, [key]: e.target.value });
  };

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

    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/users/login`,
      data: {
        email: email,
        password: password
      },
      withCredentials: true,
    })
      .then((res) => {
      // 액세스토큰 로컬 스토리지에 저장
        const isLogin = true;
        const accessToken = res.data.data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        window.localStorage.setItem("isSignin", isLogin);
        setLoginInfo(res.data.data.userInfo);
        handleResponseSuccess();
    })
    .catch((err) => {
      setErrorMessage('이메일과 비밀번호를 다시 확인하세요');
      console.log(err);
  })
  };

  // // ### 새로고침 했을 때 로그인 풀리는 것을 막기위해
  // const getLoginInfo = () => {
  //   const token = localStorage.getItem("accessToken")
  //   let config = {
  //     headers: {
  //       "access-token": token,
  //       authorization: `Bearer ${token}`,
  //       logintype: "email",
  //     }
  //   }
  //   axios
  //     .post(`${process.env.REACT_APP_API_URL}/main`, config)
  //     .then((res) => {
  //       console.log(res);
  //   })
  // }

  return (
    <>
      <div className="login__container">
      <img className="login__logo" src={logo} alt="logo" />
      <div className="login__img-box">로그인 페이지 이미지 예시</div>
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
          </form>
          <div className="login__alert-box">{errorMessage}</div>
        </div>
      </div>
    </>
  );
}
  

<>

<div className="login__container">
<img className="login__logo" src={logo} alt="logo" />

<div className="login__img-box" />

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
    </form>
    <div className="login__alert-box">{errorMessage}</div>
  </div>
</div>
</>