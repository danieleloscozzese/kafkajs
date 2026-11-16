import { describe, test, expect } from "@jest/globals";
import RequestV0Protocol from "./request.mjs";
import v0RequestModule from "../fixtures/v0_request.json" with { type: "json" };
describe("Protocol > Requests > Fetch > v0", () => {
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

    const { buffer } = await RequestV0Protocol({ maxWaitTime, minBytes, topics }).encode();
    expect(buffer).toEqual(Buffer.from(v0RequestModule));
  });
});
