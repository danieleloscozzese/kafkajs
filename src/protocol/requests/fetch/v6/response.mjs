import responseV5 from "../v5/response.mjs";
const { decode, parse } = responseV5;

/**
 * Fetch Response (Version: 6) => throttle_time_ms [responses]
 *   throttle_time_ms => INT32
 *   responses => topic [partition_responses]
 *     topic => STRING
 *     partition_responses => partition_header record_set
 *       partition_header => partition error_code high_watermark last_stable_offset log_start_offset [aborted_transactions]
 *         partition => INT32
 *         error_code => INT16
 *         high_watermark => INT64
 *         last_stable_offset => INT64
 *         log_start_offset => INT64
 *         aborted_transactions => producer_id first_offset
 *           producer_id => INT64
 *           first_offset => INT64
 *       record_set => RECORDS
 */

const responseProtocol = {
  decode,
  parse,
};

export default responseProtocol;
