import axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import HomeHashtags from "../components/HomeHashtags";
import HomeFeed from "../components/HomeFeed";
import "./Styles/Home.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Login from "./Login";
import handleResponseSuccess from "../App";

export default function Home({ getUserInfo }) {
  const isSignin = localStorage.getItem("isSignin");
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
  const [isLogin, setIsLogin] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [feeds, setFeeds] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [selectedHashtags, setSelectedHashtags] = useState([]);

  // ### 토큰으로 인증이 되었는지 확인
  const isAuthenticated = () => {
    const token = localStorage.getItem("accessToken");
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/main`,
      headers: {
        authorization: `Bearer ${token}`,
        logintype: "email",
      },
      withCredentials: true,
    })
      .then((res) => {
        setUserInfo(res.data.data.userInfo);
        // getUserInfo(userInfo);
        setIsLogin(true);
        const isSignin = localStorage.getItem("isSignin")
      })
      .catch((err) => {
        console.log("=== home ===\n" + token);
      })
  }

  // ### 토큰 응답을 제대로 받았는지 확인
  const handleResponseSuccess = () => {
    isAuthenticated();
    // setIsLogin(true);
  }

  // ### 전체 해시태그 불러오기
  const getHashtags = () => {
    const token = localStorage.getItem("accessToken");
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/main/tag`,
      headers: {
        authorization: `Bearer ${token}`,
        logintype: "email",
      },
      withCredentials: true,
    })
      .then((res) => {
        // console.log(res.data.data.tags);
        const hash = Object.entries(res.data.data.tags);
        const hashArr = [];
        const arr = [];
        for (let i in hash) {
          hashArr.push([Object.entries(hash[i][1])]);
        }
        for (let i in hashArr) {
          arr.push([hashArr[i][0][0][1], hashArr[i][0][1][1]]);
        }
        setHashtags(arr);
        // console.log(hashtags);
    })
  }

  // ### 전체 피드 불러오기
  const getFeeds = () => {
    const token = localStorage.getItem("accessToken");
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/main/feed`,
      headers: {
        authorization: `Bearer ${token}`,
        logintype: "email",
      },
      withCredentials: true,
    })
      .then((res) => {
        // console.log(res.data.data.feeds)
        const data = Object.entries(res.data.data.feeds);
        const newFeeds = [];
        for (let i in data) {
          newFeeds.push([Object.entries(data[i][1])]);
        }
        setFeeds(newFeeds);
        // console.log(newFeeds);
    })
  }

  useEffect(() => {
    getFeeds();
    getHashtags();
  }, []);

  // ### 필터링할 해시태그 선택
  const selectHashtags = () => {

    // setFeeds
    console.log(selectedHashtags);
  }

  const handleAddButton = () => {
    history.push("/feed/upload")
  };
  return (
    <>
    {
      isLogin === true || isSignin === true ?
      (
        <>
        <Nav />
        <main>
          <div className="home__hashtag-container">
            <div className="home__hashtag-title">해시태그</div>
            <span className="home__hashtag-table">
              {hashtags.map((tag, i) => {
                // return <HomeHashtags hashtag={tag} onClick={() => setSelectedHashtags([...selectedHashtags, hashtags[i]])} />;
                return <HomeHashtags hashtag={tag} onClick={ selectHashtags } />;
              })}
            </span>
          </div>
          <div className="home__feeds-container">
            <span className="home__feeds-table">
              {feeds.map((id, i) => (
                <HomeFeed feedId={id[0]} />)
              )}
            </span>
          </div>
          <button className="home__feed-add-button" onClick={ handleAddButton }>+</button>
          </main>
          </>
      ) : (
            <Login
              handleResponseSuccess={handleResponseSuccess}
              setUserInfo={setUserInfo}
              userInfo={userInfo}
              getHashtags={getHashtags}
            />
      )
      }
      <Footer />
      </>
    );
}



/*
  feedInfo 에서 사용 feeds - id, thumnail, tags[0], tags[1] (있다면). 없으면 tags[0]
*/