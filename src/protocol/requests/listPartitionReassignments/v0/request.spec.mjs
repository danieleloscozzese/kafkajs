import { describe, test, expect } from "@jest/globals";
import RequestV0Protocol from "./request.mjs";
import v0Request from "../fixtures/v0_request.json" with { type: "json" };
/* TO-DO: Update the fixtures, data, and errors */

describe("Protocol > Requests > AlterPartitionReassignments > v0", () => {
  test("request", async () => {
    const { buffer } = await RequestV0Protocol({
      topics: [
        {
          topic: "test-topic-1f131dd7f83b8d72a447-33298-d13ec602-1a34-41c8-b59e-0657aef3ad25",
          partitions: [0],
        },
      ],
      timeout: 5000,
    }).encode();
    expect(buffer).toEqual(Buffer.from(v0Request));
  });
});
