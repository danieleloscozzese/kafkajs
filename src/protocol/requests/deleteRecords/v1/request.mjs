import requestV0 from "../v0/request.mjs";
/**
 * DeleteRecords Request (Version: 1) => [topics] timeout_ms
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition offset
 *       partition => INT32
 *       offset => INT64
 *   timeout => INT32
 */
const requestProtocol = ({ topics, timeout }) =>
  Object.assign(requestV0({ topics, timeout }), { apiVersion: 1 });

export default requestProtocol;
