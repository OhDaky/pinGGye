import React from "react";
import Footer from "../components/Footer";
import "./Styles/Signup.css";

export default function Signup() {
  return (
    <>
      <div className="main">
        <div className="sign-up">
          <div className="main__message">회원가입</div>
          <input className="input__email" type="email" placeholder="Email" />
          <input
            className="input__nickname"
            type="text"
            placeholder="Nickname"
          />
          <input
            className="input__password"
            type="password"
            placeholder="Password"
          />
          <button className="sign-in__btn">Sign in</button>
        </div>
      </div>
      <Footer />
    </>
  );
}
