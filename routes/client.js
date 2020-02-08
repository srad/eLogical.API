const express = require("express");
const router = express.Router();
const connect = require("../services/mongo");
const mongoose = require("mongoose");

router.get("/stats", (req, res, next) => {
  connect.then(({Client, Answer}) => {
    const token = req.headers.authorization.split(" ")[1];
    Client.findOne({client: token})
      .then(client => {
        Answer.query.stats({client}).then(result => res.send(result))
          .catch(error => {
            console.error(error);
            res.status(400).send({error});
          });
      })
      .catch(error => {
        console.error(error);
        res.status(400).send({error});
      });
  });
});

router.get("/top/:limit?", function (req, res, next) {
  connect.then(({Answer}) => {
      Answer.query.topScores({limit: req.params.limit})
        .then(result => res.send(result))
        .catch(error => {
          console.error(error);
          res.status(400).send({error});
        });
    })
    .catch(error => {
      console.error(error);
      res.status(400).send({error});
    });
});

module.exports = router;
