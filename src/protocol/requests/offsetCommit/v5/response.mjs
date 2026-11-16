import responseV4 from "../v4/response.mjs";
const { parse, decode } = responseV4;

/**
 * OffsetCommit Response (Version: 5) => throttle_time_ms [responses]
 *   throttle_time_ms => INT32
 *   responses => topic [partition_responses]
 *     topic => STRING
 *     partition_responses => partition error_code
 *       partition => INT32
 *       error_code => INT16
 */
const responseProtocol = {
  decode,
  parse,
};

export default responseProtocol;
