import React from "react";
import Nocontent from "./Styles/no_content.png";
import "./Styles/NoContent.css";

export default function NoContent() {
  return (
    <>
      <div className="no-content">
        <img src={Nocontent} alt="no content" />
      </div>
    </>
  );
}
