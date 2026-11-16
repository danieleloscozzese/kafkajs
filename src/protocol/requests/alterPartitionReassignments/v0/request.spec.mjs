import { describe, test, expect } from "@jest/globals";
import RequestV0Protocol from "./request.mjs";
import v0Request from "../fixtures/v0_request.json" with { type: "json" };
describe("Protocol > Requests > AlterPartitionReassignments > v0", () => {
  test("request", async () => {
    const { buffer } = await RequestV0Protocol({
      topics: [
        {
          topic: "test-topic-1",
          partitionAssignment: [
            { partition: 0, replicas: [0, 1] },
            { partition: 1, replicas: [1, 2] },
          ],
        },
        {
          topic: "test-topic-2",
          partitionAssignment: [{ partition: 0, replicas: [0, 2] }],
        },
      ],
      timeout: 30000,
    }).encode();
    expect(buffer).toEqual(Buffer.from(v0Request));
  });
});
