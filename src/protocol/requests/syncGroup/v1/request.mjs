import requestV0 from "../v0/request.mjs";
/**
 * SyncGroup Request (Version: 1) => group_id generation_id member_id [group_assignment]
 *   group_id => STRING
 *   generation_id => INT32
 *   member_id => STRING
 *   group_assignment => member_id member_assignment
 *     member_id => STRING
 *     member_assignment => BYTES
 */

const requestProtocol = ({ groupId, generationId, memberId, groupAssignment }) =>
  Object.assign(requestV0({ groupId, generationId, memberId, groupAssignment }), { apiVersion: 1 });

export default requestProtocol;
