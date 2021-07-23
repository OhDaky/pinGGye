import React from "react";
import "./Styles/Mypage.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function Mypage() {
  return (
    <>
      <Nav />
      <div className="main">
        <div className="mypage">
          <div className="mypage__message">마이 페이지</div>
          <input
            className="input__email"
            type="email"
            placeholder="Email"
            readOnly
          />
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
          <button className="mypage__btn">회원 정보 수정</button>
        </div>
      </div>
      <Footer />
    </>
  );
}
