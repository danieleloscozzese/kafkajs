import { describe, expect, jest, test } from "@jest/globals";
import createStateMachine from "./transaction_state_machine.mjs";
import STATES from "./transaction_states.mjs";
import { KafkaJSNonRetriableError } from "../../errors.mjs";

const allowed = {
  UNINITIALIZED: ["READY"],
  READY: ["READY", "TRANSACTING"],
  TRANSACTING: ["COMMITTING", "ABORTING"],
  COMMITTING: ["READY"],
  ABORTING: ["READY"],
};

describe.each(Object.values(STATES))("Transaction state %s", (from) => {
  test.each(Object.values(STATES))("transition to %s", (to) => {
    const stateMachine = createStateMachine({ logger: { debug() {} }, initialState: from });
    const listener = jest.fn(() => expect(stateMachine.state()).toBe(from));
    stateMachine.on("transition", listener);
    if (allowed[from].includes(to)) {
      stateMachine.transitionTo(to);
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({ from, to });
      expect(stateMachine.state()).toBe(to);
    } else {
      expect(() => stateMachine.transitionTo(to)).toThrow(KafkaJSNonRetriableError);
      expect(listener).not.toHaveBeenCalled();
      expect(stateMachine.state()).toBe(from);
    }
    stateMachine.removeAllListeners();
  });
});

test.each([true, false])("preserves async=%s guard rejection semantics", async (isAsync) => {
  const stateMachine = createStateMachine({ logger: { debug() {} } });
  const object = { run: jest.fn() };
  const guarded = stateMachine.createGuarded(object, {
    run: { legalStates: [STATES.READY], async: isAsync },
  });
  if (isAsync) {
    await expect(guarded.run()).rejects.toThrow(KafkaJSNonRetriableError);
  } else {
    expect(() => guarded.run()).toThrow(KafkaJSNonRetriableError);
  }
  expect(object.run).not.toHaveBeenCalled();
});

test("preserves arguments, receiver, return values and late method replacement", () => {
  const stateMachine = createStateMachine({ logger: { debug() {} }, initialState: STATES.READY });
  const object = {
    value: 3,
    run(increment) {
      return this.value + increment;
    },
  };
  const guarded = stateMachine.createGuarded(object, {
    run: { legalStates: [STATES.READY], async: false },
  });
  expect(guarded).not.toBe(object);
  expect(guarded.run(4)).toBe(7);
  object.run = jest.fn(function (increment) {
    return this.value * increment;
  });
  expect(guarded.run(4)).toBe(12);
  expect(object.run).toHaveBeenCalledWith(4);
  expect(object.run.mock.contexts).toEqual([object]);
});

test("rejects guards for missing methods", () => {
  const stateMachine = createStateMachine({ logger: { debug() {} } });
  expect(() =>
    stateMachine.createGuarded(
      {},
      {
        missing: { legalStates: [STATES.READY] },
      },
    ),
  ).toThrow('Cannot add guard on missing method "missing"');
});
