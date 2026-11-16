import { describe, test, expect } from "@jest/globals";
import response from "./response.mjs";
import v0Response from "../fixtures/v0_response.json" with { type: "json" };
const { decode, parse } = response;

describe("Protocol > Requests > CreateAcls > v0", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v0Response));
    expect(data).toEqual({
      throttleTime: 0,
      creationResponses: [{ errorCode: 0, errorMessage: null }],
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });
});
