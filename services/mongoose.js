const mongoose = require("mongoose");

const schema = {
  answer: new mongoose.Schema({
    "level": new mongoose.Schema({
      current: {type: Number, min: 1, max: 100},
      max: {type: Number, min: 1, max: 100},
    }),
    "progress": new mongoose.Schema({
      current: {type: Number, min: 1, max: 100},
      max: {type: Number, min: 1, max: 100},
    }),
    "score": {type: Number, max: 100, min: 1, required: true},
    "client": {type: mongoose.Schema.Types.ObjectId, max: 200}, // client._id
    "created": {type: Date, required: true},
  }),
  client: new mongoose.Schema({
    // _id default
    "client": {type: String, required: true, max: 200}, // token
    "name": {type: String, required: true, max: 50},
    "last": {type: Date, required: true},
  }),
  tracker: new mongoose.Schema({
    "client": {type: mongoose.Types.ObjectId, required: true, max: 200}, // token
    "data": {type: Object, required: true},
  }),
};

schema.answer.index({client: 1});
schema.answer.index({created: -1});
schema.client.index({client: 1});
schema.tracker.index({client: 1});

const Client = mongoose.model("Client", schema.client);
const Answer = mongoose.model("Answer", schema.answer);
const Tracker = mongoose.model("Tracker", schema.tracker);

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
    resolve({Client, Answer, Tracker});
  });
  db.on("error", (err) => {
    reject(err);
  });
});
