const connect = require("../services/mongo");
const mongoose = require("mongoose");

function rand(min, max) {
  return Math.floor(Math.random() * max + min);
}

function create(client) {
  return {
    "client": mongoose.Types.ObjectId(client),
    "data": {
      "event": "confirm-input",
      "ops": ["and", "or", "not", "True", "False"].slice(0, rand(1, 5)),
      "success": Math.random() < 0.5,
      "difficulty": rand(1, 5),
      "level": rand(1, 5),
      "difficultySettings": ["and", "or", "not", "True", "False"],
      "variableCount": rand(1, 4),
      "levelTime": rand(250, 10000),
    },
  };
}

const token = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

beforeAll(async () => {
  const {Tracker, Client} = await connect;
  await Tracker.deleteMany({});
  await Client.create({client: token, name: "test-user"});
  const client = await Client.findOne({client: token});
  const data = new Array(100).fill(0).map(_ => create(client._id));
  await Tracker.create(data);
});

afterAll(async () => {
  const {Tracker, Client} = await connect;
  Tracker.deleteMany({});
  Client.deleteOne({client: token});
});

describe("Analytics query", () => {
  describe("Group each day by success:true/false", () => {
    test("Returns as many document as created", async () => {
      const {Tracker} = await connect;
      const result = await Tracker.query.groupBySuccess;
      expect(result[0].frequency + result[1].frequency).toBe(100);
    });
  });
});