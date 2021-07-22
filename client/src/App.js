import axios from "axios";
import { Route, Switch } from "react-router-dom";
import Feed from "./components/Feed";
import FeedUpload from "./components/FeedUpload";
import Nav from "./components/Nav";
import Home from "./components/Home";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Mypage from "./components/Mypage";
import Signup from "./components/Signup";

function App() {
  axios
    .get(`${process.env.REACT_APP_API_URL}/`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => console.error(err));

  return (
    <>
      <Nav />
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/feed" exact>
          <Feed />
        </Route>
        <Route path="/feed/upload">
          <FeedUpload />
        </Route>
        <Route path="/landing">
          <Landing />
        </Route>
        <Route path="/login">
          <Login />
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
