import { describe, test, expect } from "@jest/globals";
import response from "./response.mjs";
import v0Response from "../fixtures/v0_response.json" with { type: "json" };
const { decode, parse } = response;

describe("Protocol > Requests > DescribeAcls > v0", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v0Response));
    expect(data).toEqual({
      throttleTime: 0,
      errorCode: 0,
      errorMessage: null,
      resources: [
        {
          resourceType: 2,
          resourceName:
            "test-topic-064a1bcf62c877843e3c-18742-da400056-f741-4b3e-a725-b758d8104afa",
          acls: [
            {
              principal: "User:bob-eef72cddd1a7bb3f1252-18742-bcac65c3-bec4-42ac-8f30-00314f6d428e",
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
