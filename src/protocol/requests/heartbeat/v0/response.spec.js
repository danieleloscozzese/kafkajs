const { describe, test, expect } = require("@jest/globals");

const { unsupportedVersionResponse } = require("testHelpers");
const { decode, parse } = require("./response.js");

describe("Protocol > Requests > Heartbeat > v0", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(require("../fixtures/v0_response.json")));
    expect(data).toEqual({ errorCode: 0 });

    await expect(parse(data)).resolves.toBeTruthy();
  });

  test("throws KafkaJSProtocolError if the api is not supported", async () => {
    await expect(decode(unsupportedVersionResponse())).rejects.toThrow(
      /The version of API is not supported/,
    );
  });
});
