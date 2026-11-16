import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { createRequire } from "node:module";
import createRetry from "./index.mjs";
import { KafkaJSNumberOfRetriesExceeded, KafkaJSNonRetriableError } from "../errors.mjs";

const require = createRequire(import.meta.url);

describe("Retry", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Math, "random").mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("shares the synchronous factory through the CommonJS path", async () => {
    expect(require("./index.js")).toBe(createRetry);
    const retry = createRetry();
    expect(typeof retry).toBe("function");
    await expect(retry(async () => "result")).resolves.toBe("result");
    expect(jest.getTimerCount()).toBe(0);
  });

  it.each([
    [0, 80],
    [0.5, 100],
    [0.999, 120],
  ])("preserves initial jitter for random sample %s", async (random, expected) => {
    Math.random.mockReturnValue(random);
    const fn = jest.fn(async (_bail, _count, retryTime) => retryTime);
    await expect(createRetry({ initialRetryTime: 100, factor: 0.2 })(fn)).resolves.toBe(expected);
    expect(fn).toHaveBeenCalledWith(expect.any(Function), 0, expected);
  });

  it("preserves exponential delays, the cap, and exhaustion details", async () => {
    const cause = new Error("retryable");
    const fn = jest.fn(async () => {
      throw cause;
    });
    const result = createRetry({
      initialRetryTime: 100,
      factor: 0,
      multiplier: 2,
      maxRetryTime: 250,
      retries: 2,
    })(fn);
    const rejection = expect(result).rejects.toMatchObject({
      name: "KafkaJSNumberOfRetriesExceeded",
      retryCount: 2,
      retryTime: 250,
      cause,
    });
    await jest.runAllTimersAsync();
    await rejection;
    await expect(result).rejects.toBeInstanceOf(KafkaJSNumberOfRetriesExceeded);
    expect(fn.mock.calls.map(([, count, time]) => [count, time])).toEqual([
      [0, 100],
      [1, 200],
      [2, 250],
    ]);
    expect(jest.getTimerCount()).toBe(0);
  });

  it.each([
    new TypeError("invalid input"),
    Object.assign(new Error("non-retriable"), { retriable: false }),
  ])("does not retry unrecoverable errors: %s", async (cause) => {
    const fn = jest.fn(async () => {
      throw cause;
    });
    const result = createRetry()(fn);
    await expect(result).rejects.toBeInstanceOf(KafkaJSNonRetriableError);
    await expect(result).rejects.toMatchObject({ cause });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(jest.getTimerCount()).toBe(0);
  });

  it("bails with the original error without scheduling another attempt", async () => {
    const error = new Error("stop");
    const fn = jest.fn(async (bail) => {
      bail(error);
    });
    await expect(createRetry()(fn)).rejects.toBe(error);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(jest.getTimerCount()).toBe(0);
  });
});
