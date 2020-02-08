const express = require("express");
const router = express.Router();
const connect = require("../services/mongo");
const mongoose = require("mongoose");

router.post("/", function (req, res, next) {
  connect.then(({Client, Tracker}) => {
    const token = req.headers.authorization.split(" ")[1];
    Client.findOne({client: token}).select("_id")
      .then(user => {
        const doc = {client: mongoose.Types.ObjectId(user._id), data: req.body};
        Tracker.create(doc)
          .then(() => res.send())
          .catch(err => {
            console.error(err);
            res.status(400).send(err);
          });
      });
  });
});

router.get("/", function (req, res, next) {
  connect.then(({Tracker, Client}) => {
    const token = req.headers.authorization.split(" ")[1];
    Client.findOne({client: token})
      .then(client => {
        Promise.all([
          Tracker.query.matchClientGroupBySuccessAndOperator({client}),
          Tracker.query.matchClientGroupBySuccess({client}),
          Tracker.query.matchClientGroupByEvent({client}),
          Tracker.query.matchClientGroupEventsByDay({client}),
        ]).then(result => {
            res.send({
              groupBySuccessAndOp: result[0],
              groupBySuccess: result[1],
              groupByEvent: result[2],
              groupEventByDay: result[3],
            });
          })
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

module.exports = router;
