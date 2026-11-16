import { describe, test, expect } from "@jest/globals";
import RequestV1Protocol from "./request.mjs";
import v1RequestModule from "../fixtures/v1_request.json" with { type: "json" };
describe("Protocol > Requests > Fetch > v1", () => {
  test("request", async () => {
    const minBytes = 1;
    const maxWaitTime = 5;
    const maxBytes = 1048576; // 1MB
    const topics = [
      {
        topic: "test-topic",
        partitions: [
          {
            partition: 0,
            fetchOffset: 0,
            maxBytes,
          },
        ],
      },
    ];

    const { buffer } = await RequestV1Protocol({ maxWaitTime, minBytes, topics }).encode();
    expect(buffer).toEqual(Buffer.from(v1RequestModule));
  });
});
