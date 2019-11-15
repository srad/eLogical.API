const mongoose = require("mongoose");

const schema = {
  answer: new mongoose.Schema({
    "level": Object,
    "progress": Object,
    "score": Number,
    "client": mongoose.Schema.Types.ObjectId,
    "created": Date,
  }),
  client: new mongoose.Schema({
    "client": String,
    "name": String,
    "last": Date,
  }),
};

schema.answer.index({client: 1});
schema.answer.index({created: -1});
schema.client.index({client: 1});

const Client = mongoose.model("Client", schema.client);
const Answer = mongoose.model("Answer", schema.answer);

const url = process.env.CONNECTION_STRING;

module.exports = new Promise((resolve, reject) => {
  mongoose.connect(url, {
    useNewUrlParser: true,
    retrywrites: false,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  const db = mongoose.connection;

  db.once("open", () => {
    resolve({Client, Answer});
  });
  db.on("error", (err) => {
    reject(err);
  });
});
