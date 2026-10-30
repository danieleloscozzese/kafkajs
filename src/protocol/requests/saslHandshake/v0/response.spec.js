const { describe, test, expect } = require("@jest/globals");

const { unsupportedVersionResponse } = require("testHelpers");
const { decode } = require("./response.js");

describe("Protocol > Requests > SASLHandshake > v0", () => {
  test("throws KafkaJSProtocolError if the api is not supported", async () => {
    await expect(decode(unsupportedVersionResponse())).rejects.toThrow(
      /The version of API is not supported/,
    );
  });
});
