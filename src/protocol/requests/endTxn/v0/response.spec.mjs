import { describe, test, expect } from "@jest/globals";
import response0 from "./response.mjs";
import testHelpers0 from "testHelpers";
import v0Response from "../fixtures/v0_response.json" with { type: "json" };
const { decode, parse } = response0;
const { unsupportedVersionResponseWithTimeout } = testHelpers0;

describe("Protocol > Requests > EndTxn > v0", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v0Response));
    expect(data).toEqual({
      throttleTime: 0,
      errorCode: 0,
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });

  test("throws KafkaJSProtocolError if the api is not supported", async () => {
    await expect(decode(unsupportedVersionResponseWithTimeout())).rejects.toThrow(
      /The version of API is not supported/,
    );
  });
});
