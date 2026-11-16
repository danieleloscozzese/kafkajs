import requestV0 from "../v0/request.mjs";
/**
 * LeaveGroup Request (Version: 1) => group_id member_id
 *   group_id => STRING
 *   member_id => STRING
 */

const requestProtocol = ({ groupId, memberId }) =>
  Object.assign(requestV0({ groupId, memberId }), { apiVersion: 1 });

export default requestProtocol;
