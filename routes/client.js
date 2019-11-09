const express = require("express");
const router = express.Router();
const connect = require("../services/mongoose");

router.get("/", function (req, res, next) {
  connect.then(models => {
    // Only expose this data to the client.
    const user = {
      last: req.session.user.last,
      name: req.session.user.name,
    };
    models.Answer.findOne({client: req.session.clientid}).sort({created: -1}).limit(1)
      .then(doc => {
        if (doc) {
          res.send({
            last: {
              exercise: doc.exercise,
              level: doc.level,
              current: doc.current,
              score: doc.score,
              created: doc.created,
            },
            user,
          });
        } else {
          res.send({user});
        }
      })
      .catch(error => {
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
      {$lookup: {from: "clients", localField: "_id", foreignField: "client", as: "client"}},
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
