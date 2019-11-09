// |=========================================================
// | This express app only handles API calls
// | and does not serve any content.
// |
// | This file only configures the express app instance
// | and is imported bin /bin/www
// |=========================================================

const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.CONNECTION_STRING,
  collection: "sessions",
  databaseName: "elogical"
});

const answerRoute = require("./routes/answer");
const clientRoute = require("./routes/client");
const clientMiddleware = require("./middleware/client");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.set("trustproxy", true);

app.use(session({
  secret: process.env.SECRET || "You secret",
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: {secure: process.env.NODE_ENV === "production", maxAge: 1000 * 60 * 60 * 24 * 180},
}));

app.use(clientMiddleware);

app.use("/client", clientRoute);
app.use("/answer", answerRoute);

module.exports = app;
