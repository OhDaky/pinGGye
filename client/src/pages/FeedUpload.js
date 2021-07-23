import React from "react";
import "./Styles/FeedUpload.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function FeedUpload() {
  return (
    <>
      <Nav />
      <div className="main">
        <div className="feed__content">
          <div className="feed__left-content">
            <div className="feed__main-img">
              <div className="feed__main-img__topbar" />
              <h1>사진</h1>
              <div className="feed__main-img__underbar">
                <div className="feed__main-img__underbar__left-content"></div>
                <div className="feed__main-img__underbar__right-content">
                  <button className="feed__btn">업로드</button>
                </div>
              </div>
            </div>
          </div>
          <div className="feed__right-content">
            <div className="feed__main-contents">
              <div id="feed-upload__hashtag">
                <div className="feed-upload__main-message">해시태그 입력</div>
                <div className="feed-upload__hashtag-input">
                  <input
                    className="hashtag-input"
                    type="text"
                    placeholder="해시태그를 입력하세요"
                  />
                  <button className="hashtag-submit-btn">입력</button>
                </div>
                <div className="feed-upload__hashtag-box">
                  <div className="hashtag">#해시태그</div>
                  <div className="hashtag">#해시태그</div>
                  <div className="hashtag">#해시태그</div>
                  <div className="hashtag">#해시태그</div>
                  <div className="hashtag">#해시태그</div>
                </div>
              </div>
              <div id="feed-upload__img-content">
                <div className="feed-upload__main-message">
                  사진에 대한 내용 입력 칸
                </div>
                <textarea className="feed-upload__content" rows="8" />
              </div>
              <div className="feed-upload__underbar">
                <button className="feed__btn">제 출</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
