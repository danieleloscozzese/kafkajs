import { describe, test, expect } from "@jest/globals";
import RequestV0Protocol from "./request.mjs";
import v0Request from "../fixtures/v0_request.json" with { type: "json" };
describe("Protocol > Requests > CreateTopics > v0", () => {
  test("request", async () => {
    const { buffer } = await RequestV0Protocol({
      topics: [
        { topic: "test-topic-c8d8ca3d95495c6b900d" },
        { topic: "test-topic-050fb2e6aed13a954288" },
      ],
      timeout: 5000,
    }).encode();
    expect(buffer).toEqual(Buffer.from(v0Request));
  });
});
