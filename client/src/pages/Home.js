import React, { useState } from "react";
import HomeHashtags from "../components/HomeHashtags";
import HomeFeed from "../components/HomeFeed";
import "./Styles/Home.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function Home() {
  const tags = [
    "야근",
    "술자리",
    "결혼식",
    "고양이",
    "시험",
    "영화관",
    "제사",
    "데이트",
    "수리",
    "집",
  ];

  // 초기 전체사진. setFeeds로 해시태그 필터 -> 필터된 사진
  const [feeds, setFeeds] = useState({}); 
  const [selectedHashtag, setSelectedHashtag] = useState('');

  return (
    <>
      <Nav />
      <main>
        <div className="home__hashtag-container">
          <div className="home__hashtag-title">해시태그</div>
          <span className="home__hashtag-table">
            {tags.map((tag, i) => {
              return <HomeHashtags input={tag} />;
            })}
          </span>
        </div>
        <div className="home__feeds-container">
          {tags.map((tag, i) => {
            return <HomeFeed input={tag} />;
          })}
        </div>
        <div className="home__feed-add-button">+</div>
        <Footer />
      </main>
    </>
  );
}
