import { describe, test, expect } from "@jest/globals";
import RequestV0Protocol from "./request.mjs";
import v0Request from "../fixtures/v0_request.json" with { type: "json" };
import v0RequestMetadata from "../fixtures/v0_request_metadata.json" with { type: "json" };
describe("Protocol > Requests > OffsetCommit > v0", () => {
  test("request", async () => {
    const topic = "test-topic-eb1a285cda2e9f9a1021";
    const groupId = "consumer-group-id-9ea5b85471316d2753ab";
    const topics = [{ topic, partitions: [{ partition: 0, offset: "0" }] }];

    const { buffer } = await RequestV0Protocol({ groupId, topics }).encode();
    expect(buffer).toEqual(Buffer.from(v0Request));
  });

  test("request with metadata", async () => {
    const topic = "test-topic-eb1a285cda2e9f9a1021";
    const groupId = "consumer-group-id-9ea5b85471316d2753ab";
    const topics = [{ topic, partitions: [{ partition: 0, offset: "0", metadata: "test" }] }];

    const { buffer } = await RequestV0Protocol({ groupId, topics }).encode();
    expect(buffer).toEqual(Buffer.from(v0RequestMetadata));
  });
});
