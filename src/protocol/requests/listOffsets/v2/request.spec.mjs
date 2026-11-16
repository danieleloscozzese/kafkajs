import { describe, test, expect } from "@jest/globals";
import RequestV2Protocol from "./request.mjs";
import v2RequestModule from "../fixtures/v2_request.json" with { type: "json" };
describe("Protocol > Requests > ListOffsets > v2", () => {
  test("request", async () => {
    const timestamp = 1509285569484;
    const topics = [
      {
        topic: "test-topic-727705ce68c29fedddf4",
        partitions: [{ partition: 0, timestamp }],
      },
    ];

    const { buffer } = await RequestV2Protocol({ replicaId: -1, topics }).encode();
    expect(buffer).toEqual(Buffer.from(v2RequestModule));
  });
});
