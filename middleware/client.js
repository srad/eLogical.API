const connect = require("../model/mongoose");
const uuid = require("uuid");
const {uniqueNamesGenerator} = require("unique-names-generator");

// |================================================
// | Generate private uuid for each client
// | This shall never be shared with the client.
// |================================================

module.exports = function (req, res, next) {
  // Auto generate for now user names.
  if (!req.session.clientid) {
    req.session.clientid = uuid.v4();
  }

  connect.then(models => {
    const newClient = {client: req.session.clientid, last: new Date()};

    models.Client.findOne({client: req.session.clientid})
      .then(doc => {
        if (!doc) {
          newClient.name = uniqueNamesGenerator({
            separator: "-",
            length: 3,
          });
          models.Client.create(newClient).then(() => {
            req.session.user = newClient;
            next();
          }).catch(error => {
            res.status(400);
            next();
          });
        } else {
          req.session.user = doc;
          next();
        }
      })
      .catch(error => {
        res.status(400);
        next();
      });
  });
};