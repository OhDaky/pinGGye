import React from "react";

import "./Styles/NoContent.css";
import Nocontent from "../static/images/no_content.png";

export default function NoContent() {
  return (
    <>
      <div className="no-content">
        <img src={Nocontent} alt="no content" />
      </div>
    </>
  );
}
