import React, { useState } from "react";
import "./Styles/HomeHashtags.css";

export default function HomeHashtags({
  hashtag,
  selectTags,
  deleteSelectedHashtags,
}) {
  const [isSelected, setIsSelected] = useState(false);
  const handleHashtagClick = () => {
    if (isSelected === false) {
      setIsSelected(true);
      handleSelect(isSelected);
    } else {
      setIsSelected(false);
      handleSelect(isSelected);
    }
  };

  const handleSelect = (isSelected) => {
    if (isSelected === false) {
      selectTags(hashtag);
    } else {
      deleteSelectedHashtags(hashtag);
    }
  };

  return (
    <>
      {isSelected ? (
        <button className="home__hashtag-selected" onClick={handleHashtagClick}>
          # {hashtag}
        </button>
      ) : (
        <button className="home__hashtag" onClick={handleHashtagClick}>
          # {hashtag}
        </button>
      )}
    </>
  );
}
