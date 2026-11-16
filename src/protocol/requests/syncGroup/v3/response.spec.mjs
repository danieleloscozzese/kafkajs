import { describe, test, expect } from "@jest/globals";
import response0 from "./response.mjs";
import v3Response from "../fixtures/v3_response.json" with { type: "json" };
import v1MemberAssignment from "../fixtures/v1_memberAssignment.json" with { type: "json" };
const { decode, parse } = response0;

describe("Protocol > Requests > SyncGroup > v3", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v3Response));
    expect(data).toEqual({
      clientSideThrottleTime: 0,
      throttleTime: 0,
      errorCode: 0,
      memberAssignment: Buffer.from(v1MemberAssignment),
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });
});
