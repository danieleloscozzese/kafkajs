import { describe, test, expect } from "@jest/globals";
import RequestV1Protocol from "./request.mjs";
import v0Request from "../fixtures/v0_request.json" with { type: "json" };
describe("Protocol > Requests > InitProducerId > v1", () => {
  test("request", async () => {
    const transactionalId = "initproduceridtransaction";
    const transactionTimeout = 30000;

    const { buffer } = await RequestV1Protocol({ transactionalId, transactionTimeout }).encode();
    expect(buffer).toEqual(Buffer.from(v0Request));
  });
});
