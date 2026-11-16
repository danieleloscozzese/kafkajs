import { describe, test, expect } from "@jest/globals";
import RequestV0Protocol from "./request.mjs";
import CONFIG_RESOURCE_TYPES from "../../../config_resource_types.mjs";
import v0Request from "../fixtures/v0_request.json" with { type: "json" };
describe("Protocol > Requests > AlterConfigs > v0", () => {
  test("request", async () => {
    const { buffer } = await RequestV0Protocol({
      resources: [
        {
          type: CONFIG_RESOURCE_TYPES.TOPIC,
          name: "test-topic-d7fa92c03177d87573b1-38076-21364f66-8613-47e0-b273-bc9de397515e",
          configEntries: [{ name: "cleanup.policy", value: "compact" }],
        },
      ],
      validateOnly: false,
    }).encode();
    expect(buffer).toEqual(Buffer.from(v0Request));
  });
});
