const connect = require("../services/mongo");
const mongoose = require("mongoose");

const token = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

beforeAll(async () => {
  const {Client} = await connect;
  await Client.deleteOne({client: token});
});

afterAll(async () => {
  const {Client} = await connect;
  await Client.deleteOne({client: token});
});

describe("User query", () => {
  test("Estimate document count", async () => {
    const {Client} = await connect;
    const result = await Client.estimatedDocumentCount();
    expect(result).toBeGreaterThan(0);
  });
});