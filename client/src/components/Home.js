import React from "react";
import HomeHashtags from "./HomeHashtags";
import HomeFeed from "./HomeFeed";
import "./Styles/Home.css"

export default function Home() {
  const tags = ["야근", "술자리", "결혼식", "고양이", "시험", "영화관", "제사", "데이트", "수리", "집"];

  return (
    <center>
      <div className="home__hashtag-container">
        <div className="home__hashtag-title">해시태그</div>
        {tags.map((tag, i) => {
          return <HomeHashtags input={tag} />
        })}
      </div>
      <div className="home__feeds-container">
        {tags.map((tag, i) => {
            return <HomeFeed input={tag} />
          })}
      </div>
      <div className="home__feed-add-button">+</div>
    </center>
  );
}
