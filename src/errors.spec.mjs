import { describe, expect, it } from "@jest/globals";
import { createRequire } from "node:module";
import errors, * as namedErrors from "./errors.mjs";
import constants, * as namedConstants from "./constants.mjs";

const require = createRequire(import.meta.url);

describe("Foundational exports", () => {
  it("shares every error export with the CommonJS compatibility path", () => {
    expect(require("./errors.js")).toBe(errors);
    for (const [name, value] of Object.entries(errors)) {
      expect(namedErrors[name]).toBe(value);
    }
  });

  it("preserves error inheritance, metadata and predicates", () => {
    const protocolError = new namedErrors.KafkaJSProtocolError({
      message: "rebalancing",
      type: "REBALANCE_IN_PROGRESS",
      code: 27,
      retriable: true,
    });
    expect(protocolError).toBeInstanceOf(namedErrors.KafkaJSError);
    expect(protocolError).toMatchObject({
      name: "KafkaJSProtocolError",
      message: "rebalancing",
      type: "REBALANCE_IN_PROGRESS",
      code: 27,
      retriable: true,
    });
    expect(namedErrors.isKafkaJSError(protocolError)).toBe(true);
    expect(namedErrors.isRebalancing(protocolError)).toBe(true);
    expect(new namedErrors.KafkaJSLockTimeout("timeout")).toBeInstanceOf(
      namedErrors.KafkaJSNonRetriableError,
    );
    expect(new namedErrors.KafkaJSLockTimeout("timeout").retriable).toBe(false);
    expect(new namedErrors.KafkaJSInvariantViolation("test").helpUrl).toContain(
      "/new?assignees=&labels=bug",
    );
  });

  it("preserves constants and shares the CommonJS compatibility object", () => {
    expect(require("./constants.js")).toBe(constants);
    expect(constants).toEqual({
      EARLIEST_OFFSET: -2,
      LATEST_OFFSET: -1,
      INT_32_MAX_VALUE: 2147483647,
    });
    for (const [name, value] of Object.entries(constants)) {
      expect(namedConstants[name]).toBe(value);
    }
  });
});
