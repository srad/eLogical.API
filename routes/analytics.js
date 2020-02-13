const express = require("express");
const router = express.Router();
const connect = require("../services/mongo");

router.get("/", function (req, res, next) {
  connect.then(({Tracker}) => {
    Promise.all([
        Tracker.query.groupByEvents,
        Tracker.query.groupBySuccess,
        Tracker.query.groupEventsByDay,
        Tracker.query.countUsers,
        Tracker.query.groupByLootSelected,
        Tracker.query.groupBySuccessAndOperator,
        Tracker.query.groupByGameEndAndDifficulty,
      ])
      .then(result => res.send({
        groupByEvents: result[0],
        groupBySuccess: result[1],
        groupEventsByDay: result[2],
        countUsers: result[3],
        groupByLootSelected: result[4],
        groupBySuccessAndOperator: result[5],
        groupByGameEndAndDifficulty: result[6],
      }))
      .catch(error => {
        console.error(error);
        res.status(400).send({error});
      });
  }).catch(error => {
    console.error(error);
    res.status(400).send({error});
  });
});

module.exports = router;
