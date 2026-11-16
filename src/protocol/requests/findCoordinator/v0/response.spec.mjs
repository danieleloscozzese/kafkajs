import { describe, test, expect } from "@jest/globals";
import testHelpers0 from "testHelpers";
import response0 from "./response.mjs";
import v0Response from "../fixtures/v0_response.json" with { type: "json" };
const { unsupportedVersionResponse } = testHelpers0;
const { decode, parse } = response0;

describe("Protocol > Requests > FindCoordinator > v0", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v0Response));
    expect(data).toEqual({
      errorCode: 0,
      coordinator: { nodeId: 1, host: "192.168.1.155", port: 9095 },
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });

  test("throws KafkaJSProtocolError if the api is not supported", async () => {
    await expect(decode(unsupportedVersionResponse())).rejects.toThrow(
      /The version of API is not supported/,
    );
  });
});
