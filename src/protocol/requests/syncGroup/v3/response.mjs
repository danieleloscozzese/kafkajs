import responseV2 from "../v2/response.mjs";
const { decode, parse } = responseV2;

/**
 * SyncGroup Response (Version: 2) => throttle_time_ms error_code member_assignment
 *   throttle_time_ms => INT32
 *   error_code => INT16
 *   member_assignment => BYTES
 */
const responseProtocol = {
  decode,
  parse,
};

export default responseProtocol;
