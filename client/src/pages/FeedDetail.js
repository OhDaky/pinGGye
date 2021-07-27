import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Styles/FeedDetail.css";
import Nav from "../components/Nav";
import axios from "axios";
import Footer from "../components/Footer";
import FeedComment from "../components/FeedComment";
import UploadModal from "../components/UploadModal";

export default function FeedDetail() {
  // ? ###### Default Value ######
  let pinGGyeURL = process.env.REACT_APP_API_URL;
  const history = useHistory();

  // ? ###### url의 feedId 구하는 함수 ######
  let feedId;
  const getFeedId = () => {
    return window.location.pathname.split("/")[2];
  };
  feedId = getFeedId();

  // ! @@@@@@@@@@ Test Zone @@@@@@@@@@
  // ! @@@@@@@@@@ Test Zone @@@@@@@@@@
  // ! @@@@@@@@@@ Test Zone @@@@@@@@@@
  // ! @@@@@@@@@@ Test Zone @@@@@@@@@@

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

  // ? ###### 해당 id의 모든 feed Data 불러오기  ######
  const [feedData, setFeedData] = useState({
    subject: "",
    image: "",
    nickname: "",
    createdAt: "",
    updatedAt: "",
    download: 0,
    tags: [],
  });

  // ? # 해시태그를 텍스트로 바꿔주는 과정.
  const arrToStr = (arr) => {
    let temp = "";
    arr.forEach((el) => (temp += "," + el));
    return temp.slice(1);
  };

  const handleFeedAllUpdate = async () => {
    await axios({
      method: "get",
      url: `${pinGGyeURL}/feeds/${feedId}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
        logintype: "email",
      },
    })
      .then((resp) => {
        console.log("###Update", resp);
        const {
          subject,
          image,
          nickname,
          createdAt,
          updatedAt,
          download,
          tags,
        } = resp.data.data.feed;

        setFeedData({
          FeedComment,
          subject,
          image,
          nickname,
          createdAt,
          updatedAt,
          download,
          tags: arrToStr(tags),
        });
        console.log("this is feed data", feedData);
      })
      .catch((err) => console.log(err));
  };

  // ! @@@@@@@@@@ Test Zone @@@@@@@@@@
  // ! @@@@@@@@@@ Test Zone @@@@@@@@@@
  // ! @@@@@@@@@@ Test Zone @@@@@@@@@@
  // ! @@@@@@@@@@ Test Zone @@@@@@@@@@

  // ? ###### input comment State ######
  const [inputComment, setInputComment] = useState("");

  // ? ###### commentBox comment State ######
  const [commentBox, setCommentBox] = useState([]);

  // ! ###### feed update(modal) & Delete ######
  // ! ###### feed update(modal) & Delete ######
  // ! ###### feed update(modal) & Delete ######
  const [isUpload, setIsUpload] = useState(false);

  const handleBack = () => {
    setIsUpload(false);
  };

  const handleInputValue = (key) => (e) => {
    setFeedData({ ...feedData, [key]: e.target.value });
  };

  const patchFeed = async () => {
    await axios({
      method: "patch",
      url: `${pinGGyeURL}/feeds/${feedId}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
        logintype: "email",
      },
      data: {
        tagsText: feedData.tags,
        subject: feedData.subject,
      },
    })
      .then((resp) => console.log("##update", resp))
      .catch((err) => console.log("##update", err));
  };
  // ? ###### feed upload function ######
  const handleFeedUpdate = async () => {
    if (isUpload) {
      console.log("모달 꺼짐");
      patchFeed();
      setIsUpload(false);
    } else {
      console.log("모달 켜짐");
      setIsUpload(true);
    }
  };

  const deleteFeed = async () => {
    await axios({
      method: "delete",
      url: `${pinGGyeURL}/feeds/${feedId}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
        logintype: "email",
      },
    })
      .then((resp) => {
        console.log("##delete", resp);
        history.push("/");
      })
      .catch((err) => console.log("##delete", err));
  };

  // ! ###### feed update(modal) & Delete ######
  // ! ###### feed update(modal) & Delete ######
  // ! ###### feed update(modal) & Delete ######

  // ? ###### 이미지 다운로드 ######
  const downloadImage = async () => {
    await axios({
      method: "patch",
      url: `${pinGGyeURL}/feeds/${feedId}/egg`,
      headers: {
        authorization: `Bearer ${accessToken}`,
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
  const getComment = async () => {
    await axios({
      method: "get",
      url: `${pinGGyeURL}/feeds/${feedId}/comment`,
      headers: {
        authorization: `Bearer ${accessToken}`,
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
          authorization: `Bearer ${accessToken}`,
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
      {isUpload ? (
        <UploadModal
          feedData={feedData}
          handleInputValue={handleInputValue}
          handleFeedUpdate={handleFeedUpdate}
          handleBack={handleBack}
        />
      ) : null}
      <div className="feed-detail__main">
        <div className="feed-detail__content">
          <div className="feed-detail__left-content">
            <div className="feed-detail__main-img">
              <img
                className="feed-detail__main-img"
                referrerPolicy="no-referrer"
                src={feedData.image}
                alt="사진"
              />
              <div className="feed-detail__main-img__underbar">
                <div className="feed-detail__main-img__underbar__left-content">
                  <span>{feedData.tags}</span>
                </div>
                <a
                  className="feed-detail__main-img__underbar__right-content"
                  // href={feedData.image}
                  href={feedData.image}
                  download
                  onClick={downloadImage}
                >
                  <img
                    className="egg-img"
                    src="https://cdn0.iconfinder.com/data/icons/easter-color-1/100/egg_pink-512.png"
                    alt="계란쓰"
                  />
                  <div className="egg-count">{feedData.download}</div>
                </a>
              </div>
            </div>
          </div>
          <div className="feed-detail__right-content">
            <div className="feed-detail__writter">
              <div>{feedData.nickname}</div>
              <div className="feed-detail__UD-box">
                <button onClick={handleFeedAllUpdate}>업데이트</button>
                <button onClick={handleFeedUpdate}>수정</button>
                <button onClick={deleteFeed}>삭제</button>
              </div>
            </div>
            <div className="feed-detail__main-content">{feedData.subject}</div>
            <div className="feed-detail__comments">
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
              <div className="feed-detail__comments-box">
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
