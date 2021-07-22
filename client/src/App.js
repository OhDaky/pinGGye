import axios from "axios";
import { Route, Switch } from "react-router-dom";
import Nav from "./components/Nav";
import FeedDetail from "./pages/FeedDetail";
import FeedUpload from "./pages/FeedUpload";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Mypage from "./pages/Mypage";
import Signup from "./pages/Signup";

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
          <FeedDetail />
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
