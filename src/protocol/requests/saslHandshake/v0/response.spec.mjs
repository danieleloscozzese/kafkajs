import { describe, test, expect } from "@jest/globals";
import testHelpers from "testHelpers";
import response from "./response.mjs";
const { unsupportedVersionResponse } = testHelpers;
const { decode } = response;

describe("Protocol > Requests > SASLHandshake > v0", () => {
  test("throws KafkaJSProtocolError if the api is not supported", async () => {
    await expect(decode(unsupportedVersionResponse())).rejects.toThrow(
      /The version of API is not supported/,
    );
  });
});
