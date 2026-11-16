import { describe, test, expect } from "@jest/globals";
import response0 from "./response.mjs";
import CONFIG_RESOURCE_TYPES from "../../../config_resource_types.mjs";
import v0Response from "../fixtures/v0_response.json" with { type: "json" };
const { decode, parse } = response0;

describe("Protocol > Requests > AlterConfigs > v1", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v0Response));
    expect(data).toEqual({
      resources: [
        {
          errorCode: 0,
          errorMessage: null,
          resourceName:
            "test-topic-d7fa92c03177d87573b1-38076-21364f66-8613-47e0-b273-bc9de397515e",
          resourceType: CONFIG_RESOURCE_TYPES.TOPIC,
        },
      ],
      clientSideThrottleTime: 0,
      throttleTime: 0,
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });
});
