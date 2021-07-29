import React from "react";
import ReactLoading from "react-loading";

import Footer from "../components/Footer";

import "./Styles/Landing.css";

export default function Landing() {
  const type = "bubbles";
  const color = "rgba(255, 255, 255)";
  return (
    <div className="landing">
      <div className="landing__container">
        <div className="landing-img" />
        <ReactLoading
          className="loading"
          type={type}
          color={color}
          height={100}
          width={200}
        />
        <div className="landing-text">마켓 가는 중!</div>
      </div>
      <Footer className="footer" />
    </div>
  );
}
