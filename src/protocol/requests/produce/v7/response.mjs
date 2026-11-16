import responseV6 from "../v6/response.mjs";
const { decode, parse } = responseV6;

/**
 * Produce Response (Version: 7) => [responses] throttle_time_ms
 *   responses => topic [partition_responses]
 *     topic => STRING
 *     partition_responses => partition error_code base_offset log_append_time log_start_offset
 *       partition => INT32
 *       error_code => INT16
 *       base_offset => INT64
 *       log_append_time => INT64
 *       log_start_offset => INT64
 *   throttle_time_ms => INT32
 */

const responseProtocol = {
  decode,
  parse,
};

export default responseProtocol;
