const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const client = require("../models/client");

const secret = process.env.SECRET || "You secret";

router.post("/", function (req, res) {
  const user = client.create();
  const payload = user;
  const token = jwt.sign(payload, secret);
  user.client = token;

  client.save(user)
    .then(_ => res.send(user))
    .catch(error => res.status(401).send(error));
});

module.exports = router;