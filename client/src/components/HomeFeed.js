import React from "react";
import { useHistory } from "react-router-dom";

import "./Styles/HomeFeed.css"

export default function HomeFeed({ feedId }) {
  let history = useHistory();
  const id = feedId[0][1];
  const tags = feedId[7][1];
  const thumbnail = feedId[3][1];
  const handleFeedClick = () => {
    console.log("피드클릭");
    history.push(`/feeds/${id}`);
    // 해당하는 피드의 아이디
  }
  // console.log(id+"  "+thumbnail);

  return (
    <>
      <span className="home__feed" onClick={handleFeedClick} feedId={feedId} >
        <span className="home__feed-thumbnail-container">
          <img className="home__feed-thumbnail" src={thumbnail} /> 
          <img className="home__feed-gradient" />
          {/* {
            tags.map((i) => {
              return <span className="home__feed-tags">#{i}</span>
            })
          } */}
          </span>
        <span className="home__feed-tags">#{ tags[0] }</span>
      </span>
    </>
  )
}