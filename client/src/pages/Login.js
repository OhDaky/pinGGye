import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GoogleButton from "react-google-button";
import axios from "axios";

import "./Styles/Login.css";
import logo from "../static/images/pinGGyeLogo.png";

export default function Login({ handleResponseSuccess }) {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const handleInputValue = (key) => (e) => {
    setLoginInfo({ ...loginInfo, [key]: e.target.value });
  };

  const handleLogin = () => {
    const { email, password } = loginInfo;
    if (!email && !password) {
      setErrorMessage("이메일과 비밀번호를 입력하세요");
      return;
    } else if (!email) {
      setErrorMessage("이메일을 입력하세요");
      return;
    } else if (!password) {
      setErrorMessage("비밀번호를 입력하세요");
    }

    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/users/login`,
      data: {
        email: email,
        password: password,
      },
      withCredentials: true,
    })
      .then((res) => {
        // ? # 액세스토큰 로컬 스토리지에 저장
        const accessToken = res.data.data.accessToken;
        const loginType = res.data.data.userInfo.signUpType;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("loginType", loginType);
        setLoginInfo(res.data.data.userInfo);
        handleResponseSuccess();
        window.location.replace("/");
      })
      .catch((err) => {
        setErrorMessage("이메일과 비밀번호를 다시 확인하세요");
      });
  };

  // ? # 소셜 로그인
  const getAccessToken = async (authorizationCode) => {
    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/login/google`, {
        authorizationCode: authorizationCode,
      })
      .then((res) => {
        const accessToken = res.data.data.accessToken;
        const loginType = res.data.data.userInfo.signUpType;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("loginType", loginType);
        handleResponseSuccess();
        window.location.replace("/");
      });
  };

  useEffect(() => {
    // ? # 페이지 새로고침 시마다 url에 code 쿼리 파라미터가 있으면 추출하여 getAccessToken 호출
    const url = new URL(window.location.href);
    const authorizationCode = url.searchParams.get("code");
    if (authorizationCode) {
      getAccessToken(authorizationCode); // 서버에 AJAX call
    }
  }, []);

  const socialLoginHandler = () => {
    window.location.assign(GOOGLE_LOGIN_URL);
  };

  const google_client_id =
    "204319481381-2loiedqtk9uoac7bp7npoq9qmi9ntc89.apps.googleusercontent.com";
  const redirect_uri = "https://www.pinggye.com";

  const GOOGLE_LOGIN_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${google_client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=profile email&access_type=offline`;

  return (
    <>
      <div className="login__container">
        <img className="login__logo" src={logo} alt="logo" />
        <div className="login__img-box" />
        <div className="login__login-box">
          <div className="login__container-title">Login</div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="login__input-email">
              <div>email</div>
              <input
                className="inputbox-email"
                type="email"
                onChange={handleInputValue("email")}
              ></input>
            </div>
            <div className="login__input-password">
              <div>password</div>
              <input
                className="inputbox-login"
                type="password"
                onChange={handleInputValue("password")}
              />
            </div>
            <div>
              <button
                className="login__btn-login"
                type="submit"
                onClick={handleLogin}
              >
                로그인
              </button>
            </div>
            <div>
              <GoogleButton
                type="light"
                onClick={socialLoginHandler}
                data-border-radius="5px"
              />
            </div>
            <div>
              <button className="login__btn-signup">
                <Link to="/signup">회원가입</Link>
              </button>
            </div>
          </form>
          <div className="login__alert-box">{errorMessage}</div>
        </div>
      </div>
    </>
  );
}
