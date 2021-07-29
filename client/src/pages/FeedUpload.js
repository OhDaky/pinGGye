import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Styles/FeedUpload.css";
import axios from "axios";

import Nav from "../components/Nav";
import Footer from "../components/Footer";

import xBtn from "../static/images/xBtn.png";

export default function FeedUpload() {
  let pinGGyeURL = process.env.REACT_APP_API_URL;
  // ? ###### accessToken props로 받아오기 ######
  let accessToken = localStorage.getItem("accessToken");

  // ? ###### 메인 페이지로 redirect ######
  const history = useHistory();

  // ? ###### 피드 이미지 state ######
  const [image, setImage] = useState({
    file: "",
    previewURL: "",
  });

  // ? ###### 피드 제목 state ######
  const [subject, setSubject] = useState("");

  // ? ###### 에러 메세지 state ######
  const [hashTagError, setHashTagError] = useState("");

  // ? ###### 해시태그 state ######
  const [inputHashTag, setInputHashTag] = useState("");
  const [hashTags, setHashTags] = useState([]);
  // ? ###### 이미지 업로드 ######
  const handleFileOnChange = (event) => {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      setImage({
        file: file,
        previewURL: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };
  const hiddenFileInput = React.useRef(null);

  // ? # 이미지 업로드 버튼 커스터마이징
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  // ? ###### 해시태그 로직 ######
  // ? # 해시태그 엔터 입력
  const handleKeypress = (e) => {
    if (e.key === "Enter") {
      handleHashtag();
    }
  };
  // ? # 해시태그 입력시 입력칸 초기화
  const resetInput = () => {
    const hashTagInput = document.querySelector(".hashtag-input");
    hashTagInput.value = "";
    setInputHashTag("");
  };

  // ? # 해시태그 입력
  const handleHashtag = () => {
    if (hashTags.length >= 5) {
      setHashTagError("해시태그는 최대 5개입니다.");
      resetInput();
    } else {
      if (inputHashTag.includes(" "))
        setHashTagError("해시태그에_띄워쓰기는_하지않습니다.");
      else if (inputHashTag) {
        if (hashTags.includes(inputHashTag))
          setHashTagError("이미 있는 해시태그 입니다.");
        else {
          setHashTags([...hashTags, inputHashTag]);
          resetInput();
          setHashTagError("");
        }
      }
    }
  };
  // ? # 해시태그 제거
  const handleDeleteTag = (i) => {
    setHashTags([...hashTags.slice(0, i), ...hashTags.slice(i + 1)]);
  };

  // ? # 해시태그 array -> string
  // ? # ['이것은', '해시태그', '입니다'] -> '이것은,해시태그,입니다'
  let temp = "";
  hashTags.forEach((el) => (temp += "," + el));
  let hashTagSTR = temp.slice(1);

  // ? ###### 피드 업로드 ######
  const handleSubmitFeed = () => {
    const formData = new FormData();
    formData.append("image", image.file);
    formData.append("subject", subject);
    formData.append("tagsText", hashTagSTR);
    // ? # formData 확인하는 방법
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    // ? ###### formData 서버로 업로드 ######
    axios({
      method: "post",
      url: `${pinGGyeURL}/feeds/upload`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${accessToken}`,
        logintype: localStorage.getItem("loginType"),
      },
    })
      .then((resp) => {
        console.log(resp);
        if (resp.status === 201) {
          alert("피드가 성공적으로 업로드 되었습니다.");
          history.push("/");
        }
      })
      .catch((err) => alert(`에러 발생! 에러코드 ${err}`));
  };
  console.log("####", image.previewURL.includes(""));
  return (
    <>
      <Nav />
      <div className="feed-upload-main">
        <div className="feed-upload__content">
          <div className="feed-upload__left-content">
            <div className="feed-upload__main-img">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileOnChange}
                style={{ display: "none" }}
                ref={hiddenFileInput}
              />
              {image.previewURL ? (
                <img
                  className="feed-upload__profile_preview"
                  src={image.previewURL}
                  alt=""
                ></img>
              ) : null}
            </div>
            <div className="feed-upload__main-underbar">
              <button className="feed-upload__btn" onClick={handleClick}>
                Select Image
              </button>
            </div>
          </div>
          <div className="feed-upload__right-content">
            <div className="feed-upload__main-contents">
              <div id="feed-upload__img-content">
                <div className="feed-upload__main-title">피드 제목</div>
                <input
                  className="feed-upload__subject"
                  type="text"
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div id="feed-upload__hashtag">
                <div className="feed-upload__main-title">해시태그 입력</div>
                <div className="feed-upload__hashtag-input">
                  <input
                    className="hashtag-input"
                    type="text"
                    placeholder="해시태그를 입력하세요"
                    onChange={(e) => setInputHashTag(e.target.value)}
                    onKeyPress={handleKeypress}
                  />
                  <button
                    className="hashtag-submit-btn"
                    onClick={handleHashtag}
                  >
                    입력
                  </button>
                </div>
                <div className="signup__alert-box">{hashTagError}</div>
                {hashTags.length > 0 ? (
                  <div className="feed-upload__hashtag-box">
                    {hashTags.map((hashTag, i) => (
                      <div key={i} className="hashtag">
                        # {hashTag}
                        <img
                          onClick={() => {
                            handleDeleteTag(i);
                            setHashTagError("");
                          }}
                          src={xBtn}
                          alt="X"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-hashtag">해시태그를 입력하세요!</div>
                )}
              </div>

              <div className="feed-upload__underbar">
                <button className="feed-upload__btn" onClick={handleSubmitFeed}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer className="footer"/>
    </>
  );
}
