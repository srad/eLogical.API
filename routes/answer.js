const express = require("express");
const router = express.Router();
const connect = require("../services/mongoose");

router.post("/", function (req, res, next) {
  connect.then(models => {
    const doc = {
      exercise: req.body.exercise || null,
      level: parseInt(req.body.level) || 1,
      current: parseInt(req.body.current) || 0,
      score: parseInt(req.body.score) || 0,
      client: req.session.clientid,
      created: new Date(),
    };
    models.Answer.create(doc).then(() => {
      delete doc.client;
      res.send(doc);
      next();
    }).catch(err => {
      res.status(400).send(err);
      next();
    });
  });
});

module.exports = router;
