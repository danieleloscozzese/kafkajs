import { describe, test, expect } from "@jest/globals";
import response from "./response.mjs";
import v1Response from "../fixtures/v1_response.json" with { type: "json" };
const { decode, parse } = response;

describe("Protocol > Requests > DeleteAcls > v1", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v1Response));
    expect(data).toEqual({
      clientSideThrottleTime: 0,
      throttleTime: 0,
      filterResponses: [
        {
          errorCode: 0,
          errorMessage: null,
          matchingAcls: [
            {
              errorCode: 0,
              errorMessage: null,
              resourceType: 2,
              resourceName:
                "test-topic-000b0fa9008f920bc684-20826-6bcf579e-e882-47b8-9586-e778588f9e78",
              resourcePatternType: 3,
              principal: "User:bob-51fe15d9fc1c5a3be5f2-20826-fcf12830-b5a1-477a-8ac9-866a4088273a",
              host: "*",
              operation: 2,
              permissionType: 3,
            },
          ],
        },
      ],
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });
});
