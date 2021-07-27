import React from "react";

export default function UploadModal({
  handleInputValue,
  handleFeedUpdate,
  feedData,
  handleBack,
}) {
  console.log("###@!#!@#", feedData);
  const goToBack = () => {
    handleBack();
  };
  return (
    <>
      <div className="upload-modal__background">
        <div className="upload-modal__main">
          <img className="modal__image" src={feedData.image} />
          <input
            className="modal__subject"
            onChange={handleInputValue("subject")}
            defaultValue={feedData.subject}
          />
          <input
            className="modal__hashTag"
            onChange={handleInputValue("tags")}
            defaultValue={feedData.tags}
          />
          <button onClick={handleFeedUpdate}>수정 완료</button>
          <button onClick={goToBack}>뒤로 가기</button>
        </div>
      </div>
    </>
  );
}

{
  /* <UploadModal
tempImage={tempImage}
feedContent={feedContent}
handleInputValue={handleInputValue}
handleFeedUpdate={handleFeedUpdate}
/>

<div className="upload-modal__background">
<div className="upload-modal__main">
  <img className="modal__image" src={tempImage} />
  <input
    className="modal__subject"
    onChange={handleInputValue("subject")}
    defaultValue={feedContent.subject}
  />
  <input
    className="modal__hashTag"
    onChange={handleInputValue("tags")}
    defaultValue={feedContent.tags}
  />
  <button onClick={handleFeedUpdate}>수정 완료</button>
</div>
</div> */
}
