import { describe, test, expect } from "@jest/globals";
import RequestV0Protocol from "./request.mjs";
import CONFIG_RESOURCE_TYPES from "../../../config_resource_types.mjs";
import v0Request from "../fixtures/v0_request.json" with { type: "json" };
describe("Protocol > Requests > DescribeConfigs > v0", () => {
  test("request", async () => {
    const { buffer } = await RequestV0Protocol({
      resources: [
        {
          type: CONFIG_RESOURCE_TYPES.TOPIC,
          name: "test-topic-332d38bc4eee2ff29df6",
          configNames: ["compression.type", "retention.ms"],
        },
      ],
    }).encode();
    expect(buffer).toEqual(Buffer.from(v0Request));
  });
});
