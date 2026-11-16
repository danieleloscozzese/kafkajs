import { describe, test, expect } from "@jest/globals";
import RequestV0Protocol from "./request.mjs";
import v0Request from "../fixtures/v0_request.json" with { type: "json" };
describe("Protocol > Requests > JoinGroup > v0", () => {
  test("request", async () => {
    const groupId = "test-group";

    const { buffer } = await RequestV0Protocol({
      groupId,
      sessionTimeout: 30000,
      memberId: "",
      protocolType: "consumer",
      groupProtocols: [{ name: "default" }],
    }).encode();

    expect(buffer).toEqual(Buffer.from(v0Request));
  });
});
