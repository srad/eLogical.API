const express = require("express");
const router = express.Router();
const connect = require("../services/mongoose");
const mongoose = require("mongoose");

router.post("/", function (req, res, next) {
  connect.then(({Client, Answer}) => {
    const token = req.headers.authorization.split(" ")[1];
    Client.findOne({client: token}).select("_id")
      .then(user => {
        const doc = {
          level: req.body.level || null,
          current: req.body.progress || null,
          score: parseInt(req.body.score),
          client: mongoose.Types.ObjectId(user._id),
          created: new Date(),
        };
        Answer.create(doc).then(() => {
          res.send();
          next();
        }).catch(err => {
          res.status(400).send(err);
          next();
        });
      });
  });
});

module.exports = router;
