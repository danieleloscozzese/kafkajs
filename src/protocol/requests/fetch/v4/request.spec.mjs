import { describe, test, expect } from "@jest/globals";
import RequestV4Protocol from "./request.mjs";
import v4RequestModule from "../fixtures/v4_request.json" with { type: "json" };
describe("Protocol > Requests > Fetch > v4", () => {
  test("request", async () => {
    const minBytes = 1;
    const maxBytes = 10485760; // 10MB
    const maxWaitTime = 5;
    const maxBytesPerPartition = 1048576; // 1MB
    const topics = [
      {
        topic: "test-topic",
        partitions: [
          {
            partition: 0,
            fetchOffset: 0,
            maxBytes: maxBytesPerPartition,
          },
        ],
      },
    ];

    const { buffer } = await RequestV4Protocol({
      maxWaitTime,
      minBytes,
      maxBytes,
      topics,
    }).encode();
    expect(buffer).toEqual(Buffer.from(v4RequestModule));
  });
});
