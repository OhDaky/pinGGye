import React from "react";
import "./Styles/UploadModal.css";

export default function UploadModal({
  handleInputValue,
  handleFeedUpdate,
  feedData,
  handleBack,
}) {
  const goToBack = () => {
    handleBack();
  };
  return (
    <>
      <div className="upload-modal__background">
        <div className="upload-modal__main">
          <div className="upload-modal__topbar">
            <button className="modal__back-btn" onClick={goToBack}>
              X
            </button>
          </div>
          <img className="modal__image" src={feedData.image} />
          <div className="title-box">
            <span>제목</span>
          </div>
          <input
            className="modal__subject"
            onChange={handleInputValue("subject")}
            defaultValue={feedData.subject}
          />
          <div className="title-box">
            <span>해시태그</span>
          </div>
          <input
            className="modal__hashTag"
            onChange={handleInputValue("tags")}
            defaultValue={feedData.tags}
          />
          <button className="modal__update-btn" onClick={handleFeedUpdate}>
            수정 완료
          </button>
        </div>
      </div>
    </>
  );
}
