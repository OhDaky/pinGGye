import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import HomeHashtags from "../components/HomeHashtags";
import HomeFeed from "../components/HomeFeed";
import "./Styles/Home.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Login from "./Login";

export default function Home({ isLogin, userInfo, selectedHashtags, feeds }) {
  let history = useHistory();
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
    "쇼핑",
    "시험",
    "영화관",
    "제사",
    "데이트",
    "수리",
    "집",
    "쇼핑",
    "시험",
    "영화관",
    "제사",
    "데이트",
    "수리",
    "집",
    "쇼핑"
  ];

  // 초기 전체사진. setFeeds로 해시태그 필터 -> 필터된 사진
  // const [feeds, setFeeds] = useState({});
  // const [selectedHashtag, setSelectedHashtag] = useState(null);

  // 선택된 해시태그가 없으면 전체 해시태그에 해당하는 피드 보여주기
  // if (selectedHashtag === null) {
  //   setSelectedHashtag([...hashtags]);
  // } else {
  //   // setSelectedHashtag
  // }
  
  const handleResponseSuccess = () => {
    
  };

  const handleAddButton = () => {
    history.push("/feed/upload")
  };

  return (
    <>
    {
      isLogin === true ?
      (
        <>
        <Nav />
        <main>
          <div className="home__hashtag-container">
            <div className="home__hashtag-title">해시태그</div>
            <span className="home__hashtag-table">
              {tags.map((tag, i) => {
                return <HomeHashtags hashtag={tag} />;
              })}
            </span>
          </div>
          <div className="home__feeds-container">
            <span className="home__feeds-table">
              {tags.map((tag, i) => {
                return <HomeFeed feedInfo={tag} />;
              })}
            </span>
          </div>
          <button className="home__feed-add-button" onClick={ handleAddButton }>+</button>
          </main>
          </>
      ) : (
        <Login handleResponseSuccess={ handleResponseSuccess }/>
      )
      }
      <Footer />
      </>
    );
}



/*
  feedInfo 에서 사용 feeds - id, thumnail, tags[0], tags[1] (있다면). 없으면 tags[0]

*/