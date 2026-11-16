import nodeEvents from "node:events";
import errors from "../../errors.mjs";
import STATES from "./transaction_states.mjs";

const { EventEmitter } = nodeEvents;
const { KafkaJSNonRetriableError } = errors;

const VALID_STATE_TRANSITIONS = {
  [STATES.UNINITIALIZED]: [STATES.READY],
  [STATES.READY]: [STATES.READY, STATES.TRANSACTING],
  [STATES.TRANSACTING]: [STATES.COMMITTING, STATES.ABORTING],
  [STATES.COMMITTING]: [STATES.READY],
  [STATES.ABORTING]: [STATES.READY],
};

/**
 * @param {{ logger: import("../../../types").Logger, initialState?: string }} options
 */
const createStateMachine = ({ logger, initialState = STATES.UNINITIALIZED }) => {
  let currentState = initialState;

  const guard = (object, method, { legalStates, async: isAsync = true }) => {
    if (!object[method]) {
      throw new KafkaJSNonRetriableError(`Cannot add guard on missing method "${method}"`);
    }

    return (...args) => {
      const fn = object[method];

      if (!legalStates.includes(currentState)) {
        const error = new KafkaJSNonRetriableError(
          `Transaction state exception: Cannot call "${method}" in state "${currentState}"`,
        );

        if (isAsync) {
          return Promise.reject(error);
        } else {
          throw error;
        }
      }

      return fn.apply(object, args);
    };
  };

  const stateMachine = Object.assign(new EventEmitter(), {
    /**
     * Create a clone of "object" where we ensure state machine is in correct state
     * prior to calling any of the configured methods
     * @param {Object} object The object whose methods we will guard
     * @param {Record<string, { legalStates: string[], async?: boolean }>} methodStateMapping
     */
    createGuarded(object, methodStateMapping) {
      const guardedMethods = Object.keys(methodStateMapping).reduce((guards, method) => {
        guards[method] = guard(object, method, methodStateMapping[method]);
        return guards;
      }, {});

      return { ...object, ...guardedMethods };
    },
    /**
     * Transition safely to a new state
     */
    transitionTo(state) {
      logger.debug(`Transaction state transition ${currentState} --> ${state}`);

      if (!VALID_STATE_TRANSITIONS[currentState].includes(state)) {
        throw new KafkaJSNonRetriableError(
          `Transaction state exception: Invalid transition ${currentState} --> ${state}`,
        );
      }

      stateMachine.emit("transition", { to: state, from: currentState });
      currentState = state;
    },

    state() {
      return currentState;
    },
  });

  return stateMachine;
};

export default createStateMachine;
