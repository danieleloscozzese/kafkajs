import { describe, test, expect } from "@jest/globals";
import RequestV2Protocol from "./request.mjs";
import v2AssignerMetadata from "../fixtures/v2_assignerMetadata.json" with { type: "json" };
import v2Request from "../fixtures/v2_request.json" with { type: "json" };
describe("Protocol > Requests > JoinGroup > v2", () => {
  test("request", async () => {
    const { buffer } = await RequestV2Protocol({
      groupId: "consumer-group-id-b522188a3a12a1f04cfb-23702-e1ff35c7-fde9-4d58-960a-2cef8af77eef",
      sessionTimeout: 30000,
      rebalanceTimeout: 60000,
      memberId: "",
      protocolType: "consumer",
      groupProtocols: [
        {
          name: "AssignerName",
          metadata: Buffer.from(v2AssignerMetadata),
        },
      ],
    }).encode();

    expect(buffer).toEqual(Buffer.from(v2Request));
  });
});
