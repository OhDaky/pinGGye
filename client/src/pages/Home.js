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
  const isSignin = window.localStorage.getItem("isSignin");
  const history = useHistory();
  const [isLogin, setIsLogin] = useState(false); // 로그인 여부
  const [userInfo, setUserInfo] = useState({}); // 로그인한 유저 정보
  const [feeds, setFeeds] = useState([]); // 전체 피드
  // const [unselectedFeeds, setUnselectedFeeds] = useState([]); // 선택되지 않은 피드
  const [hashtags, setHashtags] = useState([]); // 전체 해시태그
  const [selectedTags, setSelectedTags] = useState([]); // 선택된 해시태그
  const [selectedFeeds, setSelectedFeeds] = useState([]); // 해시태그에 해당하는 피드

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
        setIsLogin(true);
        getUserInfo(res.data.data.userInfo);
        const isSignin = localStorage.getItem("isSignin");
        // console.log(res);
      })
      .catch((err) => {
        console.log("=== home ===\n" + token);
      });
  };

  // ### 토큰 응답을 제대로 받았는지 확인
  const handleResponseSuccess = () => {
    isAuthenticated();
  };

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
    }).then((res) => {
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
      // setSelectedTags(arr);
    });
  };

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
    }).then((res) => {
      // console.log(res.data.data.feeds)
      const data = Object.entries(res.data.data.feeds);
      const newFeeds = [];
      for (let i in data) {
        newFeeds.push([Object.entries(data[i][1])]);
      }
      setFeeds(newFeeds);
      // console.log(newFeeds);
    });
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
    let filteredTag = selectedTags.filter((tag) => tag !== input);
    setSelectedTags([...filteredTag]);
    let filteredFeeds = selectedFeeds.filter(
      (feed) => !feed[0][7][1].includes(input)
    );
    //! 선택된 태그와 제외한 태그 모두 포함한 피드가 사라짐 -> 해결방법
    setSelectedFeeds([...filteredFeeds]);
  };

  const handleAddButton = () => {
    history.push("/feed/upload");
  };

  // ### 로그인 되고 받아오는 한번만 실행되는 함수
  useEffect(() => {
    isAuthenticated();
    getFeeds();
    getHashtags();
  }, []);

  // ### state가 업데이트될 때 사용되는 함수
  useEffect(() => {
    // selectTags(selectedTags);
    // deleteSelectedHashtags(selectedTags);
  }, [selectedTags]);

  return (
    <>
      {isLogin === true || isSignin === true ? (
        <>
          <Nav />
          <main>
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
                      <HomeFeed feedId={id[0]} />
                    ))}
                  </>
                ) : (
                  <>
                    {selectedFeeds.map((id, i) => (
                      <HomeFeed feedId={id[0]} />
                    ))}
                  </>
                )}
              </span>
            </div>
            <button className="home__feed-add-button" onClick={handleAddButton}>
              +
            </button>
          </main>
        </>
      ) : (
        <Login
          handleResponseSuccess={handleResponseSuccess}
          setUserInfo={setUserInfo}
          userInfo={userInfo}
          getHashtags={getHashtags}
        />
      )}
      <Footer />
    </>
  );
}
