import { describe, test, expect } from "@jest/globals";
import response0 from "./response.mjs";
import v1Response from "../fixtures/v1_response.json" with { type: "json" };
import v1MemberAssignment from "../fixtures/v1_memberAssignment.json" with { type: "json" };
const { decode, parse } = response0;

describe("Protocol > Requests > SyncGroup > v1", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v1Response));
    expect(data).toEqual({
      throttleTime: 0,
      errorCode: 0,
      memberAssignment: Buffer.from(v1MemberAssignment),
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });
});
