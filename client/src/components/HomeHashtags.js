import React, { useState } from "react";
import "./Styles/HomeHashtags.css"

export default function HomeHashtags({ hashtag }) {
  const [isSelected, setIsSelected] = useState(false);
  const handleHashtagClick = () => {
    console.log('태그 클릭');
    if (isSelected === false) {
      setIsSelected(true);      
    } else {
      setIsSelected(false);
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