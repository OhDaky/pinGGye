import React from "react";
import "./Styles/Nav.css";

export default function Nav() {
  return (
    <>
      <div className="nav__content">
        <div className="nav__left-content">
          <div className="nav__logo">로고</div>
        </div>
        <div className="nav__center-content">NAV BAR</div>
        <div className="nav__right-content">
          <div className="nav__tab mypage__tab">마이페이지</div>
          <div className="nav__tab logout__tab">로그아웃</div>
        </div>
      </div>
    </>
  );
}
