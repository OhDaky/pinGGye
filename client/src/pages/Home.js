import axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import HomeHashtags from "../components/HomeHashtags";
import HomeFeed from "../components/HomeFeed";
import "./Styles/Home.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Login from "./Login";
import Landing from "./Landing";
import handleResponseSuccess from "../App";

export default function Home({ getUserInfo }) {
  const history = useHistory();
  const [isLogin, setIsLogin] = useState(false); // 로그인 여부
  const [userInfo, setUserInfo] = useState({}); // 로그인한 유저 정보
  const [feeds, setFeeds] = useState([]); // 전체 피드
  const [hashtags, setHashtags] = useState([]); // 전체 해시태그
  const [selectedTags, setSelectedTags] = useState([]); // 선택된 해시태그
  const [selectedFeeds, setSelectedFeeds] = useState([]); // 해시태그에 해당하는 피드
  const [loading, setLoading] = useState(false);

  // ### 토큰으로 인증이 되었는지 확인
  const isAuthenticated = () => {
    const token = localStorage.getItem("accessToken");
    setLoading(true);
    console.log(loading);
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/main`,
      headers: {
        authorization: `Bearer ${token}`,
        logintype: localStorage.getItem("loginType"),
      },
      withCredentials: true,
    })
      .then((res) => {
        setUserInfo(res.data.data.userInfo);
        setIsLogin(true);
        getUserInfo(res.data.data.userInfo);
        // 전체 해시태그 불러오기
        const hash = Object.entries(res.data.data.tags);
        const hashArr = [];
        const arr = [];
        for (let i in hash) {
          hashArr.push([Object.entries(hash[i][1])]);
        }
        for (let i in hashArr) {
          arr.push(hashArr[i][0][1][1]);
        }
        setHashtags(arr);

        // 전체 피드 불러오기
        const data = Object.entries(res.data.data.feeds);
        const newFeeds = [];
        for (let i in data) {
          newFeeds.push([Object.entries(data[i][1])]);
        }
        setFeeds(newFeeds);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        // console.log("=== home ===\n" + token);
      });
  };

  // ### 토큰 응답을 제대로 받았는지 확인
  const handleResponseSuccess = () => {
    isAuthenticated();
  };

  // ### 선택된 해시태그 가져오기
  const selectTags = (input) => {
    if (selectedTags.includes(input) === false) {
      setSelectedTags([...selectedTags, input]);
      console.log(selectedTags);
      let filtered = feeds.filter((feed) => feed[0][7][1].includes(input));
      let difference = filtered.filter((feed) => !selectedFeeds.includes(feed));
      setSelectedFeeds([...selectedFeeds, ...difference]);
    }
  };

  // ### 선택된 해시태그 지우기
  const deleteSelectedHashtags = (input) => {
    // input: 삭제된 태그
    let filteredTag = selectedTags.filter((tag) => tag !== input);
    setSelectedTags([...filteredTag]); // 필터된 태그 상태 갱신

    //* 선택된 피드 필터링
    let filteredFeeds = selectedFeeds.filter((feed) => {  // 이미 선택된 피드 순회
      const feedTags = feed[0][7][1]; // 피드(요소)의 태그 배열
      if (feedTags.includes(input)) {
        // 원래 해당 태그를 가지고 있는 피드
        for (let tag of filteredTag) {
          // 필터된 피드를 순회
          if (feedTags.some((feedTag) => feedTag === tag)) {
            // 해당 피드가 가진 태그 중, 필터된 태그를 하나라도 가지고 있으면 삭제되면 안됨
            return true;
          }
        }
        return false; // 삭제
      } else {
        // 원래 해당 태그를 가지고 있지 않은 피드 -> 삭제되면 안됨
        return true;
      }
    });
    setSelectedFeeds([...filteredFeeds]); // 필터된 피드 상태 갱신
  };

  const handleAddButton = () => {
    history.push("/feed/upload");
  };

  // ### 로그인 되고 받아오는 한번만 실행되는 함수
  useEffect(() => {
    isAuthenticated();
  }, []);

  const token = localStorage.getItem("accessToken")
  if (token === undefined) {
    setLoading(null);
  }

  if (loading && token) return <Landing />

  return (
    <>
      {isLogin === true ? (
        <>
          <Nav />
          <div className="home__main">
            <div className="home__hashtag-container">
              <div className="home__hashtag-title">해시태그</div>
              <span className="home__hashtag-table">
                {hashtags.map((tag, i) => {
                  return (
                    <HomeHashtags
                      hashtag={tag}
                      selectTags={selectTags}
                      deleteSelectedHashtags={deleteSelectedHashtags}
                    />
                  );
                })}
              </span>
            </div>
            <div className="home__feeds-container">
              <span className="home__feeds-table">
                {selectedTags.length === 0 ? (
                  <>
                    {feeds.map((id, i) => (
                      <HomeFeed feedid={id[0]} />
                    ))}
                  </>
                ) : (
                  <>
                    {selectedFeeds.map((id, i) => (
                      <HomeFeed feedid={id[0]} />
                    ))}
                  </>
                )}
              </span>
            </div>
            <button className="home__feed-add-button" onClick={handleAddButton}>
              +
            </button>
          </div>
        </>
      ) : (
        <Login
          handleResponseSuccess={handleResponseSuccess}
          setUserInfo={setUserInfo}
          userInfo={userInfo}
        />
      )}
      <Footer className="footer"/>
    </>
  );
}