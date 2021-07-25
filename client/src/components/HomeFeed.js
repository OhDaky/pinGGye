import React from "react";
import { Link, useHistory } from "react-router-dom";

import "./Styles/HomeFeed.css"

export default function HomeFeed({ feedInfo }) {
  let history = useHistory();
  const { id, tag } = feedInfo;
  const handleFeedClick = () => {
    console.log("피드클릭");
    history.push("/feed");
    // 해당하는 피드의 아이디
    // history.push("/feed/{feedId}")
  }

  return (
    <>
      <span className="home__feed" onClick= { handleFeedClick }>
        <span className="home__feed-tags"># {feedInfo}</span>
      </span>
    </>
  )
}