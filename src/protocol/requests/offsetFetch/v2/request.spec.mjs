import { describe, test, expect } from "@jest/globals";
import RequestV2Protocol from "./request.mjs";
import v2Request from "../fixtures/v2_request.json" with { type: "json" };
describe("Protocol > Requests > OffsetFetch > v2", () => {
  test("request", async () => {
    const groupId = "consumer-group-id-c7dcb2473b6a1196b2b2";
    const topics = [
      {
        topic: "test-topic-9f9b074057acd4335946",
        partitions: [{ partition: 0 }],
      },
    ];

    const { buffer } = await RequestV2Protocol({ groupId, topics }).encode();
    expect(buffer).toEqual(Buffer.from(v2Request));
  });
});
