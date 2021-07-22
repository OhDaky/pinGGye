import React from "react";
import "./Styles/Mypage.css";

export default function Mypage() {
  return (
    <>
      <div className="main">
        <div className="mypage">
          <div className="mypage__message">마이 페이지</div>
          <input
            className="input__email"
            type="email"
            placeholder="Email"
            readonly
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
    </>
  );
}
