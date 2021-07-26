import React, { useState, useEffect } from "react";
import "./Styles/FeedDetail.css";
import FeedComment from "../components/FeedComment";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import axios from "axios";

export default function FeedDetail() {
  // ? ###### Default Value ######
  let pinGGyeURL = process.env.REACT_APP_API_URL;

  // TODO : Home에서 클릭한 feedId 받아오기. 임시로 1로 저장
  let feedId = "1";

  // ! @@@@@@@@@@ Test Zone @@@@@@@@@@
  // ! 원래는 Home에서 받아와야함. 사용자 인증을 위해 임시로 해놓은 것.
  let accessToken = process.env.REACT_APP_ACCESSTOKEN;
  const [userInfo, setUserInfo] = useState({});
  const getUserInfo = async () => {
    await axios({
      method: "post",
      url: `${pinGGyeURL}/users/login`,
      data: {
        email: "kim@mail.com",
        password: "1234",
      },
    })
      .then((resp) => {
        setUserInfo(resp.data.data.userInfo);
      })
      .catch((err) => console.log(err));
  };
  // ! @@@@@@@@@@ Test Zone @@@@@@@@@@
  // ? ###### input comment State ######
  const [inputComment, setInputComment] = useState("");

  // ? ###### commentBox comment State ######
  const [commentBox, setCommentBox] = useState([]);

  // ? ###### 서버에서 댓글 가져오기 ######
  const getComment = () => {
    axios({
      method: "get",
      url: `${pinGGyeURL}/feeds/${feedId}/comment`,
      headers: {
        authorization: `bearer ${accessToken}`,
        logintype: "email",
      },
    })
      .then((resp) => {
        setCommentBox(resp.data.data.comments);
      })
      .catch((err) => console.log(err));
  };
  // ? # 최초 랜더링 시 서버에서 comments 불러오기
  useEffect(() => {
    getUserInfo();
    getComment();
  }, []);

  // ? # 댓글 입력시 입력칸 초기화
  const resetInput = () => {
    const commentInput = document.querySelector(".input-comment");
    commentInput.value = "";
    setInputComment("");
  };

  // ? # 댓글 엔터 입력
  const handleKeypress = (e) => {
    if (e.key === "Enter") {
      handleCommentSubmit();
    }
  };

  // ? ###### 서버로 데이터 제출 기능 ######
  // TODO : Require value
  // TODO : params = {:id}, Headers = logintype, Authentication, Body = textContent
  const handleCommentSubmit = async () => {
    if (inputComment.length) {
      await axios({
        method: "post",
        url: `${pinGGyeURL}/feeds/${feedId}/comment`,
        data: { textContent: inputComment },
        headers: {
          authorization: `bearer ${accessToken}`,
          logintype: "email",
        },
      })
        .then(() => {
          getComment();
          resetInput();
        })
        .catch((err) => console.log(err));
    }
  };
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
            <div className="feed__writter">글 올린 사람</div>
            <div className="feed__main-content">사진에 대한 내용</div>
            <div className="feed__comments">
              <div className="input-comment-box">
                <input
                  className="input-comment"
                  type="text"
                  placeholder="댓글 입력창"
                  onChange={(e) => setInputComment(e.target.value)}
                  onKeyPress={handleKeypress}
                />
                <button className="comment__btn" onClick={handleCommentSubmit}>
                  댓글 달기
                </button>
              </div>
              <div className="feed__comments-box">
                {commentBox.map((comment, i) => (
                  <FeedComment
                    key={i}
                    comment={comment}
                    feedId={feedId}
                    getComment={getComment}
                    userInfo={userInfo}
                    accessToken={accessToken}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
