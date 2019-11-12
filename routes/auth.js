const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const createNewClient = require("../models/client");

const secret = process.env.SECRET || "You secret";

router.get("/", function (req, res) {
  createNewClient().then(user => {
    var payload = user;
    var newToken = jwt.sign(payload, secret);
    res.send(newToken);
  })
});

module.exports = router;