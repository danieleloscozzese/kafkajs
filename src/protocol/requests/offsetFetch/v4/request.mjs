import requestV3 from "../v3/request.mjs";
/**
 * OffsetFetch Request (Version: 4) => group_id [topics]
 *   group_id => STRING
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition
 *       partition => INT32
 */

const requestProtocol = ({ groupId, topics }) =>
  Object.assign(requestV3({ groupId, topics }), { apiVersion: 4 });

export default requestProtocol;
