import { describe, test, expect } from "@jest/globals";
import RequestV0Protocol from "./request.mjs";
import v0Request from "../fixtures/v0_request.json" with { type: "json" };
describe("Protocol > Requests > AddPartitionsToTxn > v0", () => {
  test("request", async () => {
    const { buffer } = await RequestV0Protocol({
      transactionalId: "test-transactional-id",
      producerId: "1001",
      producerEpoch: 0,
      groupId: "foobar",
    }).encode();

    expect(buffer).toEqual(Buffer.from(v0Request));
  });
});
