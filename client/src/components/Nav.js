import React from "react";
import "./Styles/Nav.css";
import logo from "./Styles/pinGGyeLogo.png";
import { useHistory } from "react-router-dom";

export default function Nav() {
  // ? ###### router function ######
  const history = useHistory();
  const goToHome = () => {
    history.push("/");
  };
  const goToMypage = () => {
    history.push("/mypage");
  };

  // ? ###### logout handler function ######
  const handleLogOut = () => {
    localStorage.removeItem("accessToken");
    // history.push("/");
    window.location.replace("/");
  };
  return (
    <>
      <div className="nav__content">
        <div className="nav__left-content">
          <img className="nav__logo" src={logo} alt="logo" onClick={goToHome} />
          <div style={{ width: "50px" }}></div>
        </div>
        <div className="nav__center-content" />
        <div className="nav__right-content">
          <button className="nav__tab mypage__tab" onClick={goToMypage}>
            마이페이지
          </button>
          <button className="nav__tab logout__tab" onClick={handleLogOut}>
            로그아웃
          </button>
        </div>
      </div>
    </>
  );
}
