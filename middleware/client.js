const connect = require("../services/mongoose");
const uuid = require("uuid");
const {uniqueNamesGenerator} = require("unique-names-generator");

// |================================================
// | Generate private uuid for each client
// | This shall never be shared with the client.
// |================================================

module.exports = function (req, res, next) {

  console.log("DEBUG 1");
  // Auto generate for now user names.
  if (!req.user.client) {
    req.user.client = uuid.v4();

    console.log("New ClientID: "+req.user.client);
  }

  connect.then(models => {
    console.log("DEBUG 2");
    const newClient = {client: req.user.client, last: new Date()};

    models.Client.findOne({client: req.user.client})
      .then(doc => {
        if (!doc) {
          newClient.name = uniqueNamesGenerator({
            separator: "-",
            length: 3,
          });
          models.Client.create(newClient).then(() => {
            console.log("NEW CLIENT: "+JSON.stringify(newClient));
            req.user = newClient;
            next();
          }).catch(error => {
            res.status(400);
            next();
          });
        } else {
          req.user = doc;
          next();
        }
      })
      .catch(error => {
        res.status(400);
        next();
      });
  });
};