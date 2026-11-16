import { describe, test, expect } from "@jest/globals";
import RequestV2Protocol from "./request.mjs";
import v2RequestModule from "../fixtures/v2_request.json" with { type: "json" };
describe("Protocol > Requests > Fetch > v2", () => {
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

    const { buffer } = await RequestV2Protocol({ maxWaitTime, minBytes, topics }).encode();
    expect(buffer).toEqual(Buffer.from(v2RequestModule));
  });
});
