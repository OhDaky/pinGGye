import axios from "axios";
import { useState } from "react";
import { Route, Switch } from "react-router-dom";
import FeedDetail from "./pages/FeedDetail";
import FeedUpload from "./pages/FeedUpload";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Mypage from "./pages/Mypage";
import Signup from "./pages/Signup";

function App() {
  const token = localStorage.getItem("accessToken");
  // ### 전체에서 사용되는 유저의 정보 state
  const [userInfo, setUserInfo] = useState({
    id: "",
    email: "",
    nickname: "",
    signUpType: "",
    accountType: "",
  });

  const getUserInfo = (input) => {
    setUserInfo(input);
  };

  axios
    .get(`${process.env.REACT_APP_API_URL}/`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => console.error(err));

  return (
    <>
      <Switch>
        <Route path="/" exact>
          <Home getUserInfo={getUserInfo} />
        </Route>
        <Route path="/feed/:id" exact>
          <FeedDetail />
        </Route>
        <Route path="/feed/upload">
          <FeedUpload />
        </Route>
        <Route path="/landing">
          <Landing />
        </Route>
        <Route path="/mypage">
          <Mypage />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
      </Switch>
    </>
  );
}

export default App;
