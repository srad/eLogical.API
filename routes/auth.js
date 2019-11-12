const express = require("express");
const router = express.Router();
var jwt = require('jsonwebtoken');

const secret = process.env.SECRET || "You secret";

router.get("/", function (req, res) {
  console.log("TEST auth-path successfull");
  var payload = {} // TODO: Add ClientId or similar to JWT-payload
  var newToken = jwt.sign(payload, secret);
  res.send(newToken);
});

module.exports = router;