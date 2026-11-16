import responseV1 from "../v1/response.mjs";
const { decode, parse } = responseV1;

/**
 * Fetch Response (Version: 3) => throttle_time_ms [responses]
 *   throttle_time_ms => INT32
 *   responses => topic [partition_responses]
 *     topic => STRING
 *     partition_responses => partition_header record_set
 *       partition_header => partition error_code high_watermark
 *         partition => INT32
 *         error_code => INT16
 *         high_watermark => INT64
 *       record_set => RECORDS
 */

const responseProtocol = {
  decode,
  parse,
};

export default responseProtocol;
