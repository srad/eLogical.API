// |=========================================================
// | This express app only handles API calls
// | and does not serve any content.
// |
// | This file only configures the express app instance
// | and is imported bin /bin/www
// |=========================================================

require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const jwt = require("express-jwt");
const cors = require("cors");

const clientRoute = require("./routes/client");
const answerRoute = require("./routes/answer");
const authRoute = require("./routes/auth");

const SECRET = process.env.SECRET || "You secret";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors());

app.set("trustproxy", true);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, authorization");
  next();
});

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send("Invalid token!");
  }
});

app.use(jwt({secret: SECRET}).unless({path: ["/auth"]}));
app.use("/client", clientRoute);
app.use("/answer", answerRoute);
app.use("/auth", authRoute);

module.exports = app;