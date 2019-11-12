const connect = require("../services/mongoose");
const uuid = require("uuid");
const { uniqueNamesGenerator } = require("unique-names-generator");

var createNewClient = function () {
  const newClient = {
    client: uuid.v4(),
    last: new Date(),
    name: uniqueNamesGenerator({
      separator: "-",
      length: 3,
    })
  };

  return connect.then(models => {
    return models.Client.create(newClient).then(() => {
      return newClient;
    }).catch(error => {
      throw new Error(error); // TODO
      // return error; // TODO
    });
  });
};

module.exports = createNewClient;