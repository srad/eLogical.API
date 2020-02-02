const connector = require("../services/mongoose");
const { uniqueNamesGenerator } = require("unique-names-generator");

module.exports = {
  create() {
    return {
      client: undefined,
      last: new Date(),
      name: uniqueNamesGenerator({
        separator: "-",
        length: 2,
      })
    };
  },
  save(data) {
    return new Promise((resolve, reject) => {
      connector.then(models => {
        models.Client.create(data) 
          .then(() => resolve(data))
          .catch(error => reject(error));
      });
    });
  },
  find(token) {
    return new Promise((resolve, reject) => {
      connector.then(({Client}) => {
        Client.find({token})
          .then(data => resolve(data))
          .catch(error => reject(error));
      });
    });
  }
};