import React from "react";
import "./Styles/HomeFeed.css"

export default function HomeFeed({ input }) {
  return (
    <center>
      <span className="home__feed">
        <span className="home__feed-tags"># {input}</span>
      </span>
    </center>
  )
}