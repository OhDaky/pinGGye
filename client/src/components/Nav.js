import React from "react";
import "./Styles/Nav.css";
import logo from "./Styles/pinGGyeLogo.png";
import { useHistory } from "react-router-dom";
import logout from "./Styles/logout.png";
import mypage from "./Styles/mypage.png";

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
    localStorage.removeItem("loginType");
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
          <img
            className="nav__mypage"
            src={mypage}
            alt="mypage"
            onClick={goToMypage}
          ></img>
          <img
            className="nav__logout"
            src={logout}
            alt="logout"
            onClick={handleLogOut}
          />
        </div>
      </div>
    </>
  );
}
