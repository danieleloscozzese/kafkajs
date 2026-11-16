import requestV1 from "../v1/request.mjs";
/**
 * Heartbeat Request (Version: 2) => group_id generation_id member_id
 *   group_id => STRING
 *   generation_id => INT32
 *   member_id => STRING
 */

const requestProtocol = ({ groupId, groupGenerationId, memberId }) =>
  Object.assign(requestV1({ groupId, groupGenerationId, memberId }), { apiVersion: 2 });

export default requestProtocol;
