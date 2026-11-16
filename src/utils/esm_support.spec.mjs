import { describe, expect, jest, test } from "@jest/globals";
import { createRequire } from "node:module";
import { Kafka } from "../../index.mjs";
import { preloadProtocol } from "../../testHelpers/preload_protocol_modules.mjs";

const require = createRequire(import.meta.url);

jest.unstable_mockModule("../../testHelpers/esm_fixture.mjs", () => ({
  default: jest.fn(() => "mocked"),
}));
const { default: mockedValue } = await import("../../testHelpers/esm_fixture.mjs");

describe("ESM test support", () => {
  test("loads the ESM facade alongside CommonJS", () => {
    expect(Kafka).toBe(require("../../index.js").Kafka);
  });

  test("mocks an ESM dependency before it is imported", () => {
    expect(mockedValue()).toBe("mocked");
    expect(mockedValue).toHaveBeenCalledTimes(1);
  });

  test("awaits ESM protocol preloading", async () => {
    expect(globalThis.__kafkajsProtocolFixtureLoaded).toBeUndefined();
    await preloadProtocol("testHelpers/protocol_fixture/**/v*/@(request|response).mjs");
    expect(globalThis.__kafkajsProtocolFixtureLoaded).toBe(true);
    delete globalThis.__kafkajsProtocolFixtureLoaded;
  });
});
