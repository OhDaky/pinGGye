import React, { useState } from "react";
import "./Styles/FeedUpload.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useHistory } from "react-router-dom";
import axios from "axios";

// TODO : 피드의 id는 Database에서 부여?
export default function FeedUpload() {
  let pinGGyeURL = process.env.REACT_APP_API_URL;
  // ? ###### accessToken props로 받아오기 ######
  let accessToken = process.env.REACT_APP_ACCESSTOKEN;

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
      if (inputHashTag) {
        setHashTags([...hashTags, inputHashTag]);
        resetInput();
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
        logintype: "email",
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

  return (
    <>
      <Nav />
      <div className="main">
        <div className="feed__content">
          <div className="feed__left-content">
            <div className="feed__main-img">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileOnChange}
                style={{ display: "none" }}
                ref={hiddenFileInput}
              />
              <img
                className="feed__profile_preview"
                src={image.previewURL}
              ></img>
            </div>
            <div className="feed__main-underbar">
              <button className="feed__btn" onClick={handleClick}>
                업로드
              </button>
            </div>
          </div>
          <div className="feed__right-content">
            <div className="feed__main-contents">
              <div id="feed-upload__img-content">
                <div className="feed-upload__main-message">
                  피드 제목(subject)
                </div>
                <input
                  className="feed-upload__subject"
                  type="text"
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div id="feed-upload__hashtag">
                <div className="feed-upload__main-message">해시태그 입력</div>
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
                <div className="feed-upload__hashtag-box">
                  {hashTags.map((hashTag, i) => (
                    <div key={i} className="hashtag">
                      #{hashTag}
                      <button onClick={() => handleDeleteTag(i)}>X</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="feed-upload__underbar">
                <button className="feed__btn" onClick={handleSubmitFeed}>
                  제 출
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
