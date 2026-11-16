import { describe, test, expect } from "@jest/globals";
import testHelpers0 from "testHelpers";
import response0 from "./response.mjs";
import v0Response from "../fixtures/v0_response.json" with { type: "json" };
import v0ResponseEmptyMemberAssignment from "../fixtures/v0_response_empty_member_assignment.json" with { type: "json" };
const { unsupportedVersionResponse } = testHelpers0;
const { decode, parse } = response0;

describe("Protocol > Requests > SyncGroup > v0", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v0Response));
    expect(data).toEqual({
      errorCode: 0,
      memberAssignment: Buffer.from(
        JSON.stringify({
          "topic-test": [2, 5, 4, 1, 3, 0],
        }),
      ),
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });

  test("handles empty member assignment", async () => {
    const data = await decode(Buffer.from(v0ResponseEmptyMemberAssignment));
    expect(data).toEqual({
      errorCode: 0,
      memberAssignment: Buffer.from([]),
    });
  });

  test("throws KafkaJSProtocolError if the api is not supported", async () => {
    await expect(decode(unsupportedVersionResponse())).rejects.toThrow(
      /The version of API is not supported/,
    );
  });
});
