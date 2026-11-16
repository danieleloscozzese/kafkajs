import { describe, test, expect } from "@jest/globals";
import response0 from "./response.mjs";
import configSource0 from "../../../config_source.mjs";
import v1Response from "../fixtures/v1_response.json" with { type: "json" };
const { decode, parse } = response0;
const { DEFAULT_CONFIG } = configSource0;

describe("Protocol > Requests > DescribeConfigs > v1", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v1Response));
    expect(data).toEqual({
      throttleTime: 0,
      resources: [
        {
          errorCode: 0,
          errorMessage: null,
          resourceType: 2,
          resourceName: "topic-test1",
          configEntries: [
            {
              configName: "compression.type",
              configValue: "producer",
              readOnly: false,
              isDefault: true,
              configSource: DEFAULT_CONFIG,
              isSensitive: false,
              configSynonyms: [
                {
                  configName: "compression.type",
                  configSource: DEFAULT_CONFIG,
                  configValue: "producer",
                },
              ],
            },
            {
              configName: "retention.ms",
              configValue: "604800000",
              readOnly: false,
              isDefault: true,
              configSource: DEFAULT_CONFIG,
              isSensitive: false,
              configSynonyms: [],
            },
          ],
        },
      ],
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });
});
