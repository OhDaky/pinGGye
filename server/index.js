require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");
const createDummy = require("./seeders/dummy");

const feedRouter = require("./router/feedRouter");
const mainRouter = require("./router/mainRouter");
const userRouter = require("./router/userRouter");

const app = express();
const PORT = 80;

// Setting morgan date
const today = new Date();
const dateFormat = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString();
morgan.token("date", () => {
  return dateFormat;
});

// Middleware
app.use(morgan(`"HTTP/:http-version :method :url" :status :remote-addr - :remote-user :res[content-length] [:date]`));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
}));
app.use(cookieParser());

// Routing
app.use("/main", mainRouter);
app.use("/users", userRouter);
app.use("/feeds", feedRouter);
app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

// Error handling
app.use((req, res, next) => {
  res.status(404).send("Page Not Found!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Create dummy option
if (process.argv[2] === "dummy") {
  createDummy();
}

// Listen
app.listen(PORT, () => console.log(`http server is runnning on ${PORT}`));
