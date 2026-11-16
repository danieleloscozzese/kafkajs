import { describe, test, expect } from "@jest/globals";
import RequestV0Protocol from "./request.mjs";
import v0Request from "../fixtures/v0_request.json" with { type: "json" };
describe("Protocol > Requests > DescribeGroups > v0", () => {
  test("request", async () => {
    const groupIds = ["consumer-group-id-608e7e42043d917ecb44"];
    const { buffer } = await RequestV0Protocol({ groupIds }).encode();
    expect(buffer).toEqual(Buffer.from(v0Request));
  });
});
