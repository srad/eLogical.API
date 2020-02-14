const mongo = require("mongoose");
const events = require("./events");

/**
 * @type {{answer, tracker, client}}
 */
const schema = {
  answer: new mongo.Schema({
    "level": new mongo.Schema({
      current: {type: Number, min: 1, max: 100},
      max: {type: Number, min: 1, max: 100},
    }),
    "progress": new mongo.Schema({
      current: {type: Number, min: 1, max: 100},
      max: {type: Number, min: 1, max: 100},
    }),
    "score": {type: Number, max: 100, min: 1, required: true},
    "client": {type: mongo.Schema.Types.ObjectId, max: 200}, // client._id
    "created": {type: Date, required: true, default: Date.now},
  }),
  client: new mongo.Schema({
    "client": {type: String, required: true, max: 200}, // token
    "name": {type: String, required: true, max: 50},
    "last": {type: Date, required: true, default: Date.now},
  }),
  tracker: new mongo.Schema({
    "client": {type: mongo.Types.ObjectId, required: true, max: 200}, // token
    "created": {type: Date, required: true, default: Date.now},
    "data": {type: Object, required: true},
  }),
};

schema.answer.index({client: 1});
schema.answer.index({created: -1});
schema.client.index({client: 1});
schema.tracker.index({client: 1, created: -1});

const Client = mongo.model("Client", schema.client);
const Answer = mongo.model("Answer", schema.answer);
const Tracker = mongo.model("Tracker", schema.tracker);

const url = process.env.CONNECTION_STRING || "mongodb://127.0.0.1:27017/elogical-test";

/**
 * @type {{matchClientGroupByEvent: (function({client: *}): Aggregate), groupByEvents: Aggregate, matchClientGroupBySuccessAndOperator: (function({client: *}): Aggregate), matchClientGroupBySuccess: (function({client: *}): Aggregate), matchClientGroupEventsByDay: (function({client: *}): Aggregate), groupEventsByDay: (function({client: *}): Aggregate)}}
 */
Tracker.query = {
  // By Client
  /**
   * @param {Client} client
   * @returns {Aggregate}
   */
  matchClientGroupEventsByDay: ({client}) => Tracker.aggregate([
    {$match: {"client": {"$eq": client._id}}},
    {
      $project: {
        day: {
          $dateToString: {format: "%Y-%m-%d", date: "$created", timezone: "Europe/Berlin", onNull: new Date().toISOString().split("T")[0]},
        },
        event: "$data.event",
      },
    },
    {$group: {_id: {day: "$day", event: "$event"}, frequency: {$sum: 1}}},
    {$sort: {"day": 1, frequency: 1}},
  ]),
  /**
   * @param {Client} client
   * @returns {Aggregate}
   */
  matchClientGroupBySuccessAndOperator: ({client}) => Tracker.aggregate([
    {$match: {"client": {"$eq": client._id}, "data.event": {$eq: events.confirmInput}}},
    {$project: {success: "$data.success", ops: "$data.ops", len: {$size: "$data.ops"}}},
    {$group: {_id: {success: "$success", op: "$ops"}, frequency: {$sum: 1}}},
    {$sort: {"frequency": 1}},
    //{$group: {_id: {success: "$data.success", op: {$length:"$data.ops"}}, ops: {$push: "$data.ops"}}},
  ]),
  /**
   * @param {Client} client
   * @returns {Aggregate}
   */
  matchClientGroupBySuccess: ({client}) => Tracker.aggregate([
    {$match: {"client": {"$eq": client._id}, "data.event": {$eq: events.confirmInput}}},
    {$project: {success: "$data.success", count: {$sum: 1}}},
    {$group: {_id: {success: "$success"}, frequency: {$sum: "$count"}}},
  ]),
  /**
   * @param {Client} client
   * @returns {Aggregate}
   */
  matchClientGroupByEvent: ({client}) => Tracker.aggregate([
    {$match: {"client": {"$eq": client._id}}},
    {$project: {event: "$data.event", count: {$sum: 1}}},
    {$group: {_id: {event: "$event"}, frequency: {$sum: "$count"}}},
    {$sort: {"frequency": 1}},
  ]),
  // All data
  /**
   * @param {Client} client
   * @returns {Aggregate}
   */
   groupBySuccessAndOperator: Tracker.aggregate([
    {$match: {"data.event": {$eq: events.confirmInput}}},
    {$project: {success: "$data.success", ops: "$data.ops", len: {$size: "$data.ops"}}},
    {$group: {_id: {success: "$success", op: "$ops"}, frequency: {$sum: 1}}},
    {$sort: {"frequency": 1}},
    //{$group: {_id: {success: "$data.success", op: {$length:"$data.ops"}}, ops: {$push: "$data.ops"}}},
  ]),
  /**
   * @param {Client} client
   * @returns {Aggregate}
   */
  groupByLootSelected: Tracker.aggregate([
    {$match: {"data.event": {$eq: events.stageCompleted}}},
    {$project: {loot: "$data.loot", count: {$sum: 1}}},
    {$group: {_id: {loot: "$loot"}, frequency: {$sum: "$count"}}},
    {$sort: {"frequency": 1}},
    //{$group: {_id: {success: "$data.success", op: {$length:"$data.ops"}}, ops: {$push: "$data.ops"}}},
  ]),
  /**
   * @returns {Aggregate}
   */
  groupByEvents: Tracker.aggregate([
    {$project: {event: "$data.event", count: {$sum: 1}}},
    {$group: {_id: {event: "$event"}, frequency: {$sum: "$count"}}},
    {$sort: {"frequency": 1}},
  ]),
  /**
   * @returns {Aggregate}
   */
  groupBySuccess: Tracker.aggregate([
    {$match: {"data.event": {$eq: events.confirmInput}}},
    {$project: {success: "$data.success", count: {$sum: 1}}},
    {$group: {_id: {success: "$success"}, frequency: {$sum: "$count"}}},
  ]),
    /**
   * @returns {Aggregate}
   */
  groupByGameEndAndDifficulty: Tracker.aggregate([
    {$match: {"data.event": {$eq: events.gameEnd}}},
    {$project: {difficulty: "$data.difficulty", count: {$sum: 1}}},
    {$group: {_id: {difficulty: "$difficulty"}, frequency: {$sum: "$count"}}},
  ]),
  countUsers: Client.estimatedDocumentCount(),
  /**
   * @returns {Aggregate}
   */
  groupEventsByDay: Tracker.aggregate([
    {
      $project: {
        day: {
          $dateToString: {format: "%Y-%m-%d", date: "$created", timezone: "Europe/Berlin", onNull: new Date().toISOString().split("T")[0]},
        },
        event: "$data.event",
      },
    },
    {$group: {_id: {day: "$day", event: "$event"}, frequency: {$sum: 1}}},
    {$sort: {"day": 1, frequency: 1}},
  ]),
};

/**
 * @type {{findByToken: (function(String): Promise<unknown>)}}
 */
Client.query = {
  /**
   * @param {String} token
   * @returns {Promise<unknown>}
   */
  findByToken: token => new Promise((resolve, reject) => {
    Client.findOne({client: token})
      .then(resolve)
      .catch(error => {
        console.error(error);
        reject(error);
      });
  }),
};

/**
 * @type {{stats: (function({client: Client}): Aggregate), topScores: (function({limit: Number}): Aggregate)}}
 */
Answer.query = {
  /**
   * @param {Number} limit
   * @returns {Aggregate}
   */
  topScores: ({limit}) => Answer.aggregate([
    {$group: {_id: "$client", total: {$max: "$score"}}},
    {$lookup: {from: "clients", localField: "_id", foreignField: "_id", as: "client"}},
    {$project: {_id: false, total: true, client: {name: true}}},
    {$sort: {total: -1}},
    {$limit: Math.min(limit || 10, 100)},
  ]),
  /**
   * @param {Client} client
   * @returns {Aggregate}
   */
  stats: ({client}) => Answer.aggregate([
    {$match: {client: client._id}},
    {$group: {_id: "$client", total: {$max: "$score"}}},
    {$limit: 10},
    {$project: {_id: false, total: true, client: {name: client.name}}},
    {$sort: {total: -1}},
  ]),
};

// Ensures that the db connection is only created once
let opened = false;

module.exports = new Promise((resolve, reject) => {
  mongo.connect(url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  const db = mongo.connection;

  if (opened) {
    resolve({Client, Answer, Tracker});
  } else {
    db.once("open", () => {
      opened = true;
      resolve({Client, Answer, Tracker});
    });
    db.on("error", (err) => {
      reject(err);
    });
    db.on("disconnected", (err) => {
      opened = false;
    });
    db.on("close", (err) => {
      opened = false;
    });
  }
});
