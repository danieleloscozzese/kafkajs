import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { createRequire } from "node:module";
import getEnv from "./env.mjs";

const require = createRequire(import.meta.url);

afterEach(() => jest.restoreAllMocks());

describe("Protocol logging environment", () => {
  it("shares the getter and reads current values rather than an import-time snapshot", () => {
    expect(require("./env.js")).toBe(getEnv);
    jest.replaceProperty(process, "env", {
      ...process.env,
      KAFKAJS_DEBUG_PROTOCOL_BUFFERS: "0",
      KAFKAJS_DEBUG_EXTENDED_PROTOCOL_BUFFERS: "1",
    });
    const first = getEnv();
    process.env.KAFKAJS_DEBUG_PROTOCOL_BUFFERS = "1";
    delete process.env.KAFKAJS_DEBUG_EXTENDED_PROTOCOL_BUFFERS;
    expect(first).toEqual({
      KAFKAJS_DEBUG_PROTOCOL_BUFFERS: "0",
      KAFKAJS_DEBUG_EXTENDED_PROTOCOL_BUFFERS: "1",
    });
    expect(getEnv()).toEqual({
      KAFKAJS_DEBUG_PROTOCOL_BUFFERS: "1",
      KAFKAJS_DEBUG_EXTENDED_PROTOCOL_BUFFERS: undefined,
    });
  });
});
