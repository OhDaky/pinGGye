import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Styles/FeedDetail.css";
import Nav from "../components/Nav";
import axios from "axios";
import Footer from "../components/Footer";
import FeedComment from "../components/FeedComment";
import UploadModal from "../components/UploadModal";
import NoContent from "../components/NoContent";
import submitImg from "./Styles/submit.png"

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

  let accessToken = process.env.REACT_APP_ACCESSTOKEN;
  const [userInfo, setUserInfo] = useState({});

  // ? ###### USER INFO는 받아와야할듯?
  // ? ###### USER INFO는 받아와야할듯?
  // ? ###### USER INFO는 받아와야할듯?
  // ? ###### USER INFO는 받아와야할듯?
  const getUserInfo = async () => {
    await axios({
      method: "post",
      url: `${pinGGyeURL}/users/login`,
      data: {
        email: "admin@mail.com",
        password: "12345",
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
    tags: "",
    tagsArr: [],
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
        const { subject, image, nickname, download, tags } =
          resp.data.data.feed;
        // ? # 10번째 다운로드시 더이상 다운 불가능
        if (download >= 10) setIsMaxed(true);
        setFeedData({
          FeedComment,
          subject,
          image,
          nickname,
          download,
          tags: arrToStr(tags),
          tagsArr: tags,
        });
      })
      .catch((err) => console.log(err));
  };

  // ? ###### input comment State ######
  const [inputComment, setInputComment] = useState("");

  // ? ###### egg count >= 10이면 isMaxed === True ######
  const [isMaxed, setIsMaxed] = useState(false);

  // ? ###### commentBox comment State ######
  const [commentBox, setCommentBox] = useState([]);

  // ? ###### 내용이 없을 때, NoContent 컴포넌트 출력 ######
  const [commentNone, setCommentNone] = useState(false);

  // ? ###### feed update modal관련 ######
  const [isUpload, setIsUpload] = useState(false);

  // ? # 모달창에서 뒤로가기 클릭
  const handleBack = () => {
    setIsUpload(false);
  };

  // ? # 모달창에서 값 수정시, 해당 피드의 state 변경
  const handleInputValue = (key) => (e) => {
    setFeedData({ ...feedData, [key]: e.target.value });
  };

  // ? ###### feed upload function ######
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
      .then(() => {
        handleFeedAllUpdate();
      })
      .catch((err) => console.log("##update", err));
  };

  // ? ###### 수정버튼 누를 시 모달창 켜짐 ######
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

  // ? ###### 이미지 다운로드 ######
  // ! [BUG] : 현재 이미지 다운로드가 안됨.
  const downloadImage = async () => {
    if (isMaxed) alert("닭이 부화하여 더이상 다운받을 수 없습니다!");
    else {
      await axios({
        method: "patch",
        url: `${pinGGyeURL}/feeds/${feedId}/egg`,
        headers: {
          authorization: `Bearer ${accessToken}`,
          logintype: "email",
        },
      })
        .then((resp) => {
          handleFeedAllUpdate();
          if (resp.data.message === "You have already downloaded the image")
            alert("이미 다운로드 받은 사진입니다!");
          if (resp.data.message === "It's your feed!")
            alert("자기가 쓴 글에는 좋아요를 달 수 없습니다.");
        })
        .catch((err) => console.log(err));
    }
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
        if (!resp.data.data.comments.length) setCommentNone(true);
        setCommentBox(resp.data.data.comments);
      })
      .catch((err) => console.log(err));
  };

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
          setCommentNone(false);
          getComment();
          resetInput();
        })
        .catch((err) => console.log(err));
    }
  };

  // ? ###### 최초 랜더링 ######
  // ? # 해당 feedId를 가진 feed의 내용
  // ? # 로그인한 user info
  // ? # 해당 feedId를 가진 feed의 댓글

  const allUpdate = () => {
    handleFeedAllUpdate();
    getUserInfo();
    getComment();
  };

  useEffect(() => {
    allUpdate();
  }, []);
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
                  {feedData.tagsArr.map((hashtag, i) => (
                    <span key={i}>#{hashtag}&nbsp;&nbsp;</span>
                  ))}
                </div>
                {isMaxed ? (
                  <a
                    className="feed-detail__main-img__underbar__right-content"
                    onClick={downloadImage}
                  >
                    <img
                      className="egg-img"
                      src="https://cdn4.iconfinder.com/data/icons/animal-malibu-vol-1/128/chicken-256.png"
                      alt="꼬꼬댁쓰"
                    />
                  </a>
                ) : (
                  <a
                    className="feed-detail__main-img__underbar__right-content"
                    onClick={downloadImage}
                    // href={feedData.image}
                    // download
                  >
                    <img
                      className="egg-img"
                      src="https://cdn0.iconfinder.com/data/icons/easter-color-1/100/egg_pink-512.png"
                      alt="계란쓰"
                    />
                    <div className="egg-count">{feedData.download}</div>
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="feed-detail__right-content">
            <div className="feed-detail__topbar">
              <div className="feed-detail__writter">{feedData.nickname}</div>
              <div className="feed-detail__main-content">
                제목 : {feedData.subject}
              </div>
              <div className="feed-detail__UD-box">
                <img
                  className="icon"
                  src="https://cdn2.iconfinder.com/data/icons/vivid/48/pencil-512.png"
                  alt="update"
                  onClick={handleFeedUpdate}
                />
                <img
                  className="icon"
                  src="https://cdn1.iconfinder.com/data/icons/feather-2/24/trash-2-512.png"
                  alt="trash can"
                  onClick={deleteFeed}
                />
              </div>
            </div>
            <div className="feed-detail__comments">
              {commentNone ? (
                <NoContent />
              ) : (
                <div className="feed-detail__comments-box">
                  {commentBox.map((comment, i) => (
                    <FeedComment
                      key={i}
                      comment={comment}
                      feedId={feedId}
                      getComment={getComment}
                      userInfo={userInfo}
                      accessToken={accessToken}
                      inputComment={inputComment}
                    />
                  ))}
                </div>
              )}
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
                <img className="submitComment__btn" src={submitImg} alt="logout" onClick={handleCommentSubmit} /> 
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
