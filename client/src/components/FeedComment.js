import React from "react";
import "./Styles/FeedComment.css";

export default function FeedComment() {
  return (
    <>
      <div className="feed__comment">
        <div className="feed__comment-left-content">
          <div className="feed__comment-userName">사용자이름</div>
        </div>
        <div className="feed__comment-center-content">
          <div className="feed__comment-content">댓글내용</div>
        </div>
        <div className="feed__comment-right-content">
          <button className="feed__comment-update">수정</button>
          <button className="feed__comment-delete">삭제</button>
        </div>
      </div>
    </>
  );
}
