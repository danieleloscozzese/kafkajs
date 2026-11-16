import { describe, test, expect } from "@jest/globals";
import response from "./response.mjs";
import v1Response from "../fixtures/v1_response.json" with { type: "json" };
const { decode, parse } = response;

describe("Protocol > Requests > CreateAcls > v1", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v1Response));
    expect(data).toEqual({
      clientSideThrottleTime: 0,
      throttleTime: 0,
      creationResponses: [{ errorCode: 0, errorMessage: null }],
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });
});
