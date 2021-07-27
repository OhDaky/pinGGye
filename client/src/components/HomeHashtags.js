import React, { useState } from "react";
import "./Styles/HomeHashtags.css"

export default function HomeHashtags({ hashtag, getSelectedTags }) {
  const [isSelected, setIsSelected] = useState(false);
  const tag = hashtag[1];
  const handleHashtagClick = () => {
    if (isSelected === false) {
      console.log('태그 선택');
      setIsSelected(true);
      
    } else {
      console.log('태그 선택 해제');
      setIsSelected(false);
    }
  }

  return (
    <>{
      isSelected ? (
        <button className="home__hashtag-selected" onClick={ handleHashtagClick }>#{ tag }</button>
      ): (
        <button className="home__hashtag" onClick={ handleHashtagClick }>#{ tag }</button>
      )
    }
    </>
  )
}