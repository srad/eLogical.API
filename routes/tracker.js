const express = require("express");
const router = express.Router();
const connect = require("../services/mongoose");
const mongoose = require("mongoose");

router.post("/", function (req, res, next) {
  connect.then(({Client, Tracker}) => {
    const token = req.headers.authorization.split(" ")[1];
    Client.findOne({client: token}).select("_id")
      .then(user => {
        console.log(req.body);
        const doc = {
          client: mongoose.Types.ObjectId(user._id),
          data: req.body,
        };
        Tracker.create(doc).then(() => {
          res.send();
          next();
        }).catch(err => {
          res.status(400).send(err);
          next();
        });
      });
  });
});

router.get("/", function (req, res, next) {
  connect.then(({Tracker, Client}) => {
    const token = req.headers.authorization.split(" ")[1];
    Client.findOne({client: token})
      .then(client => {
        Tracker.find({client: client._id});//.select("-_id")
        Promise.all([
          Tracker.aggregate([
            {$match: {"client": {"$eq": client._id}, "data.event": {$eq: "confirm-input"}}},
            {$project: {success: "$data.success", ops: "$data.ops", len: {$size: "$data.ops"}}},
            {$group: {_id: {success: "$success", op: "$ops"}, frequency: {$sum: "$len"}}},
            {$sort: {"frequency": 1}},
            //{$group: {_id: {success: "$data.success", op: {$length:"$data.ops"}}, ops: {$push: "$data.ops"}}},
          ]),
          Tracker.aggregate([
            {$match: {"client": {"$eq": client._id}, "data.event": {$eq: "confirm-input"}}},
            {$group: {_id: {success: "$data.success"}, frequency: {$sum: 1}}},
          ]),
        ]).then(result => res.send({groupBySuccessAndOp: result[0], groupBySuccess: result[1]}))
          .catch(error => res.status(400).send({error}));
      }).catch(error => res.status(400).send({error}));
  });
});

module.exports = router;
