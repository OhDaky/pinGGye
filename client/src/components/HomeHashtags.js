import React from "react";
import "./Styles/HomeHashtags.css"

export default function HomeHashtags({ input }) {
  return (
    <center>
      <span className="home__hashtag">#{ input }</span>
    </center>
  )
}