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
  let feedId = "11";

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
  // ? # 메인에서 props로 받아올 예정인 데이터.
  const [tempImage, setTempImage] = useState("");
  const [tempHashTags, setTempHashTags] = useState([]);
  const [tempEggCount, setTempEggCount] = useState(0);
  const getEggCount = () => {
    axios({
      method: "get",
      url: `${pinGGyeURL}/main/feed`,
      headers: {
        authorization: `bearer ${accessToken}`,
        logintype: "email",
      },
    })
      .then((resp) => {
        console.log("이거이거", resp);
        let feed = resp.data.data.feeds[10];
        setTempImage(feed.image);
        setTempHashTags(feed.tags);
        setTempEggCount(feed.download);
      })
      .catch((err) => console.log(err));
  };
  // TODO : 사진이 모두 불러오기 전까지는 로딩사진 보여주기
  // TODO : 모든 사진이 불러와지면 그때 한번에 랜딩
  useEffect(() => {
    getEggCount();
  }, []);
  // ! @@@@@@@@@@ Test Zone @@@@@@@@@@

  // ? ###### input comment State ######
  const [inputComment, setInputComment] = useState("");

  // ? ###### commentBox comment State ######
  const [commentBox, setCommentBox] = useState([]);

  // ? ###### 알 카운트 가져오기 ######

  // ? ###### 이미지 다운로드 ######
  const downloadImage = async () => {
    await axios({
      method: "patch",
      url: `${pinGGyeURL}/feeds/${feedId}/egg`,
      headers: {
        authorization: `bearer ${accessToken}`,
        logintype: "email",
      },
    }).then((resp) => {
      // ! 현재는 직접 데이터를 수정하는거고, 메인 props를 직접 받아와주기.
      // ![BUG] : 다운로드가 referrer 정책때문에 안되는듯.
      // TODO : 서버와 이야기해보기
      console.log("####", resp);
    });
  };

  // ? ###### 서버에서 댓글 가져오기 ######
  const getComment = () => {
    axios({
      method: "get",
      url: `${pinGGyeURL}/feeds/${feedId}/comment`,
      headers: {
        Authorization: `bearer ${accessToken}`,
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
          Authorization: `bearer ${accessToken}`,
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
      <div className="feed-upload__main">
        <div className="feed-upload__content">
          <div className="feed-upload__left-content">
            <div className="feed-upload__main-img">
              <img
                className="feed-upload__main-img"
                referrerPolicy="no-referrer"
                src={tempImage}
                alt="사진"
              />
              <div className="feed-upload__main-img__underbar">
                <div className="feed-upload__main-img__underbar__left-content">
                  {tempHashTags.map((hashtag, i) => (
                    <span key={i}>#{hashtag}&nbsp;&nbsp;</span>
                  ))}
                </div>
                <a
                  className="feed-upload__main-img__underbar__right-content"
                  href={tempImage}
                  download
                  target="_blank"
                  onClick={downloadImage}
                >
                  <img
                    className="egg-img"
                    src="https://cdn0.iconfinder.com/data/icons/easter-color-1/100/egg_pink-512.png"
                    alt="계란쓰"
                  />
                  <div className="egg-count">{tempEggCount}</div>
                </a>
              </div>
            </div>
          </div>
          <div className="feed-upload__right-content">
            <div className="feed-upload__writter">글 올린 사람</div>
            <div className="feed-upload__main-content">사진에 대한 내용</div>
            <div className="feed-upload__comments">
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
              <div className="feed-upload__comments-box">
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
