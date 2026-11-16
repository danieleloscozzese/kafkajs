import responseV3 from "../v3/response.mjs";
const { parse: parseV3, decode: decodeV3 } = responseV3;

/**
 * Metadata Response (Version: 4) => throttle_time_ms [brokers] cluster_id controller_id [topic_metadata]
 *   throttle_time_ms => INT32
 *   brokers => node_id host port rack
 *     node_id => INT32
 *     host => STRING
 *     port => INT32
 *     rack => NULLABLE_STRING
 *   cluster_id => NULLABLE_STRING
 *   controller_id => INT32
 *   topic_metadata => error_code topic is_internal [partition_metadata]
 *     error_code => INT16
 *     topic => STRING
 *     is_internal => BOOLEAN
 *     partition_metadata => error_code partition leader [replicas] [isr]
 *       error_code => INT16
 *       partition => INT32
 *       leader => INT32
 *       replicas => INT32
 *       isr => INT32
 */

const responseProtocol = {
  parse: parseV3,
  decode: decodeV3,
};

export default responseProtocol;
