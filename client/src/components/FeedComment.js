import axios from "axios";
import React, { useState, useEffect } from "react";
import "./Styles/FeedComment.css";

export default function FeedComment({
  feedId,
  comment,
  getComment,
  userInfo,
  accessToken,
}) {
  // ? ###### Default value ######
  let pinGGyeURL = process.env.REACT_APP_API_URL;
  const { nickname, textContent, id } = comment;
  let commentId = id;

  // ? ###### 본인인증 state ######
  // ? # 본인 글에만 수정 / 삭제 기능이 보임.
  const [isMe, setIsMe] = useState(false);
  const handleIsMe = () => {
    setIsMe(false);
    // ? # admin의 경우 모든 댓글에 접근 가능
    // ! [BUG] admin계정은 수정과 삭제 버튼은 보이나, 실제로 작동하지 않음.
    // ! 서버측에서 김군의 토큰을 받았을 때 admin 기능을 제대로 하는지 (다른 사람의 글 접근권한) 확인해보기
    // TODO : admin에 대한 요청을 따로 구현해야 할듯
    if (userInfo.accountType === "admin") setIsMe(true);
    else {
      // ? # 본인 이메일과 댓글 이메일이 같을 경우 수정 가능
      if (userInfo.email === comment.email) {
        setIsMe(true);
      }
    }
  };

  useEffect(() => {
    handleIsMe();
    console.log("댓글 수 만큼 자기 글인지 확인");
  }, []);

  // ? ###### 댓글 state ######
  const [input, setInput] = useState(textContent);

  // ? ###### 수정 모드인지 판단하는 state ######
  const [isUpdate, setIsUpdate] = useState(false);

  // ? ###### Comment update 기능 ######
  const handleUpdateComment = () => {
    if (isUpdate) {
      axios({
        method: "patch",
        url: `${pinGGyeURL}/feeds/${feedId}/comment`,
        data: { commentId, textContent: input },
        headers: {
          authorization: `Bearer ${accessToken}`,
          logintype: "email",
        },
      }).then(() => alert("댓글 수정 완료!"));
    }
    // TODO : 댓글의 유저 ID와 현재 유저와 같은지 확인해야함.
    setIsUpdate(isUpdate ? false : true);
  };

  // ? ###### Comment delete 기능 ######
  // ! [BUG] 일시적으로 삭제한 코멘트가 아닌, 다른 코멘트가 지워짐. 새로고침하면 제대로.
  const handleDeleteComment = () => {
    axios({
      method: "delete",
      url: `${pinGGyeURL}/feeds/${feedId}/comment`,
      data: { commentId },
      headers: {
        authorization: `Bearer ${accessToken}`,
        logintype: "email",
      },
    })
      .then((resp) => {
        console.log("delete complete", resp.data.data.comments);
        getComment();
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <div className="feed__comment">
        <div className="feed__comment-left-content">
          <div className="feed__comment-userName">{commentId}</div>
          <div className="feed__comment-userName">{nickname}</div>
        </div>
        <div className="feed__comment-center-content">
          {isUpdate ? (
            <input
              className="feed__comment-content"
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          ) : (
            <input
              className="feed__comment-content"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              readOnly
            />
          )}
        </div>
        {isMe ? (
          <div className="feed__comment-right-content">
            <button
              className="feed__comment-update"
              onClick={handleUpdateComment}
            >
              수정
            </button>
            <button
              className="feed__comment-delete"
              onClick={handleDeleteComment}
            >
              삭제
            </button>
          </div>
        ) : (
          <div className="feed__comment-right-content">내꺼 아님~</div>
        )}
      </div>
    </>
  );
}
