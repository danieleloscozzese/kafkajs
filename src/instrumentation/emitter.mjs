import { EventEmitter } from "node:events";
import InstrumentationEvent from "./event.mjs";
import errors from "../errors.js";

const { KafkaJSError } = errors;

class InstrumentationEventEmitter {
  constructor() {
    this.emitter = new EventEmitter();
  }

  /**
   * @param {string} eventName
   * @param {Object} payload
   */
  emit(eventName, payload) {
    if (!eventName) {
      throw new KafkaJSError("Invalid event name", { retriable: false });
    }

    if (this.emitter.listenerCount(eventName) > 0) {
      const event = new InstrumentationEvent(eventName, payload);
      this.emitter.emit(eventName, event);
    }
  }

  /**
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   * @returns {import("../../types").RemoveInstrumentationEventListener<string>} removeListener
   */
  addListener(eventName, listener) {
    this.emitter.addListener(eventName, listener);
    return () => this.emitter.removeListener(eventName, listener);
  }
}

export default InstrumentationEventEmitter;
