import React from "react";
import "./Styles/HomeHashtags.css"

export default function HomeHashtags({ input }) {
  return (
    <>
      <button className="home__hashtag">#{ input }</button>
    </>
  )
}