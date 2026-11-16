import requestV1 from "../v1/request.mjs";
/**
 * SyncGroup Request (Version: 2) => group_id generation_id member_id [group_assignment]
 *   group_id => STRING
 *   generation_id => INT32
 *   member_id => STRING
 *   group_assignment => member_id member_assignment
 *     member_id => STRING
 *     member_assignment => BYTES
 */

const requestProtocol = ({ groupId, generationId, memberId, groupAssignment }) =>
  Object.assign(requestV1({ groupId, generationId, memberId, groupAssignment }), { apiVersion: 2 });

export default requestProtocol;
