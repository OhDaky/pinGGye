import React, { useState } from "react";
import "./Styles/HomeHashtags.css"

export default function HomeHashtags({ hashtag, selectTags, deleteSelectedHashtags }) {
  const [isSelected, setIsSelected] = useState(false);
  // const tag = hashtag[1];
  const handleHashtagClick = () => {
    if (isSelected === false) {
      console.log('태그 선택');
      setIsSelected(true);
      handleSelect(isSelected);
    } else {
      console.log('태그 선택 해제');
      setIsSelected(false);
      handleSelect(isSelected);
    }
  }

  const handleSelect = (isSelected) => {
    if (isSelected === false) {
      selectTags(hashtag);
    } else {
      deleteSelectedHashtags(hashtag);
    }
  }

  return (
    <>{
      isSelected ? (
        <button className="home__hashtag-selected" onClick={ handleHashtagClick }>#{ hashtag }</button>
      ): (
        <button className="home__hashtag" onClick={ handleHashtagClick }>#{ hashtag }</button>
      )
    }
    </>
  )
}