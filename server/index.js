require("dotenv").config();
const fs = require("fs");
const https = require("https");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");

const feedRouter = require("./router/feedRouter");
const mainRouter = require("./router/mainRouter");
const userRouter = require("./router/userRouter");

const app = express();
const PORT = 80;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(cookieParser());

// Routing
app.use("/main", mainRouter);
app.use("/users", userRouter);
app.use("/feeds", feedRouter);

app.get("/", (req, res) => {
  res.status(200).send('Hello World');
});

app.listen(PORT, () => console.log(`http server is runnning on ${PORT}`));
