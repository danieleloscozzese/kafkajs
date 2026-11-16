import requestV1 from "../v1/request.mjs";
/**
 * OffsetFetch Request (Version: 2) => group_id [topics]
 *   group_id => STRING
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition
 *       partition => INT32
 */

const requestProtocol = ({ groupId, topics }) =>
  Object.assign(requestV1({ groupId, topics }), { apiVersion: 2 });

export default requestProtocol;
