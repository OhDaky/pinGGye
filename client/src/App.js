import axios from "axios";

function App() {
  axios
    .get(`${process.env.REACT_APP_API_URL}/`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => console.error(err));

  return (
    <>
      <div>Hello pinGGye!</div>
    </>
  );
}

export default App;
