import React from "react";
import { useHistory } from "react-router-dom";

import "./Styles/HomeFeed.css";

export default function HomeFeed({ feedid }) {
  let history = useHistory();
  const id = feedid[0][1];
  const tags = feedid[7][1];
  const thumbnail = feedid[3][1];
  const handleFeedClick = () => {
    console.log("피드클릭");
    history.push(`/feed/${id}`);
    // 해당하는 피드의 아이디
  };

  return (
    <>
      <span className="home__feed" onClick={handleFeedClick} feedid={feedid}>
        <span className="home__feed-thumbnail-container">
          <img className="home__feed-thumbnail" src={thumbnail} />
          <div className="home__feed-gradient" />
          <span className="home__feed-tags">#{tags[0]}</span>
        </span>
      </span>
    </>
  );
}
