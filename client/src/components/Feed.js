import React from "react";
import "./Styles/Feed.css";
import FeedComment from "./FeedComment";

export default function Feed() {
  return (
    <>
      <div className="main">
        <div className="feed__content">
          <div className="feed__left-content">
            <div className="feed__main-img">
              <div className="feed__main-img__topbar" />
              <h1>사진</h1>
              <div className="feed__main-img__underbar">
                <div className="feed__main-img__underbar__left-content">
                  #해시태그
                </div>
                <div className="feed__main-img__underbar__right-content">
                  계란!
                </div>
              </div>
            </div>
          </div>
          <div className="feed__right-content">
            <div className="feed__main-contents">
              <div className="feed__writter">글 올린 사람</div>
              <div className="feed__main-content">사진에 대한 내용</div>
            </div>
            <div className="feed__comments">
              <div className="input-comment">
                <input type="text" placeholder="댓글 입력창" />
                <button className="comment__btn">댓글 달기</button>
              </div>
              <div className="feed__comments-box">
                <FeedComment />
                <FeedComment />
                <FeedComment />
                <FeedComment />
                <FeedComment />
                <FeedComment />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
