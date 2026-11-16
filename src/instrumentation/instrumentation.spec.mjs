import { describe, expect, it, jest } from "@jest/globals";
import { createRequire } from "node:module";
import InstrumentationEvent from "./event.mjs";
import InstrumentationEventEmitter from "./emitter.mjs";
import instrumentationEventType from "./event_type.mjs";
import errors from "../errors.js";

const require = createRequire(import.meta.url);

describe("Instrumentation", () => {
  it("shares event constructors and counters across module formats", () => {
    const CommonEvent = require("./event.js");
    expect(CommonEvent).toBe(InstrumentationEvent);
    const first = new CommonEvent("first", {});
    const second = new InstrumentationEvent("second", {});
    expect(second.id).toBe(first.id + 1);
  });

  it("emits and removes listeners with the existing event payload", () => {
    const emitter = new InstrumentationEventEmitter();
    const listener = jest.fn();
    const removeListener = emitter.addListener("consumer.test", listener);
    const payload = { count: 1 };
    emitter.emit("consumer.test", payload);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ type: "consumer.test", payload, timestamp: expect.any(Number) }),
    );
    removeListener();
    emitter.emit("consumer.test", payload);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("retains error identity and the non-retriable flag for invalid events", () => {
    const emitter = new InstrumentationEventEmitter();
    try {
      emitter.emit("", {});
      throw new Error("expected invalid event to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(errors.KafkaJSError);
      expect(error).toMatchObject({ message: "Invalid event name", retriable: false });
    }
  });

  it("shares the emitter and event type compatibility paths", () => {
    expect(require("./emitter.js")).toBe(InstrumentationEventEmitter);
    expect(require("./eventType.js")).toBe(instrumentationEventType);
    expect(instrumentationEventType("consumer")("join")).toBe("consumer.join");
  });
});
