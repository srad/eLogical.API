const express = require("express");
const router = express.Router();
const connect = require("../services/mongoose");

router.get("/stats", (req, res, next) => {
  connect.then(({Client, Answer}) => {
    const token = req.headers.authorization.split(" ")[1];
    Client.findOne({client: token})
      .then(client => {
        Answer.aggregate([
          {$match: {client: client._id}},
          {$group: {_id: "$client", total: {$sum: "$score"}}},
          {$limit: 10},
          {$project: {_id: false, total: true, client: {name: client.name}}},
          {$sort: {total: -1}},
        ]).exec((error, result) => {
          if (error) {
            res.status(400).send({error});
            return;
          }
          result.client = {name: client.name};
          res.send(result);
        });
      }).catch(error => {
      res.status(400).send({error});
      next();
    });
  });
});

router.get("/top", function (req, res, next) {
  connect.then(models => {
    models.Answer.aggregate([
      {$group: {_id: "$client", total: {$sum: "$score"}}},
      {$limit: 10},
      {$lookup: {from: "clients", localField: "_id", foreignField: "_id", as: "client"}},
      {$project: {_id: false, total: true, client: {name: true}}},
      {$sort: {total: -1}},
    ]).exec((error, result) => {
      if (error) {
        res.status(400).send({error});
        return;
      }
      res.send(result);
    });
  }).catch(error => {
    res.status(400).send({error});
    next();
  });
});

module.exports = router;
