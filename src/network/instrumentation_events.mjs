import InstrumentationEventType from "../instrumentation/event_type.mjs";
const eventType = InstrumentationEventType("network");

const events = {
  NETWORK_REQUEST: eventType("request"),
  NETWORK_REQUEST_TIMEOUT: eventType("request_timeout"),
  NETWORK_REQUEST_QUEUE_SIZE: eventType("request_queue_size"),
};

export default events;
