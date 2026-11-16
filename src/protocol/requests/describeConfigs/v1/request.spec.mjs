import { describe, test, expect } from "@jest/globals";
import RequestV1Protocol from "./request.mjs";
import ConfigResourceTypes from "../../../config_resource_types.mjs";
import v1Request from "../fixtures/v1_request.json" with { type: "json" };
describe("Protocol > Requests > DescribeConfigs > v1", () => {
  test("request", async () => {
    const { buffer } = await RequestV1Protocol({
      includeSynonyms: true,
      resources: [
        {
          type: ConfigResourceTypes.TOPIC,
          name: "topic-test1",
          configNames: ["compression.type", "retention.ms"],
        },
      ],
    }).encode();
    expect(buffer).toEqual(Buffer.from(v1Request));
  });
});
