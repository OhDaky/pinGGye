import { useState } from "react";
import { Route, Switch } from "react-router-dom";
import FeedDetail from "./pages/FeedDetail";
import FeedUpload from "./pages/FeedUpload";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Mypage from "./pages/Mypage";
import Signup from "./pages/Signup";

function App() {
  // ? ### 전체에서 사용되는 유저의 정보 state
  const [userInfo, setUserInfo] = useState({});

  // ? ### 메인페이지에서 로그인 정보 받아오기
  const getUserInfo = (input) => {
    setUserInfo(input);
  };

  return (
    <>
      <Switch>
        <Route path="/" exact>
          <Home getUserInfo={getUserInfo} />
        </Route>
        <Route path="/feed/upload">
          <FeedUpload />
        </Route>
        <Route path="/feed/:id" exact>
          <FeedDetail userInfo={userInfo} />
        </Route>
        <Route path="/landing">
          <Landing />
        </Route>
        <Route path="/mypage">
          <Mypage user={userInfo} />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
      </Switch>
    </>
  );
}

export default App;
