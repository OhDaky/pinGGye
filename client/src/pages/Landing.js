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
        <ReactLoading
          type= {type}
          color= {color}
          height={100}
          width={200} />
        <div>여기는 핑계마켓</div>
        <div className="landing-img" />
      </div>
      <Footer />
    </center>
  )
}
