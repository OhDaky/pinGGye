import React from "react";
import Footer from "../components/Footer";
import ReactLoading from "react-loading";
import "./Styles/Landing.css"

export default function Landing() {
  const type = "bubbles";
  const color = "rgba(255, 204, 204)";
  const message = "여기는 핑계마켓";
  return (
    <center>
      <div className="landing__container">
        <div className="landing-img" />
        <ReactLoading className="loading"
          type= {type}
          color= {color}
          height={100}
          width={200} />
        <div className="landing-text">마켓 가는 중!</div>
      </div>
      <Footer />
    </center>
  )
}
