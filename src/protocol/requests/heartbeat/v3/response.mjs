import responseV2 from "../v2/response.mjs";
const { parse, decode } = responseV2;

/**
 * Heartbeat Response (Version: 3) => throttle_time_ms error_code
 *   throttle_time_ms => INT32
 *   error_code => INT16
 */
const responseProtocol = {
  decode,
  parse,
};

export default responseProtocol;
