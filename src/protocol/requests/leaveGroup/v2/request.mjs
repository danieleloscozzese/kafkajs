import requestV1 from "../v1/request.mjs";
/**
 * LeaveGroup Request (Version: 2) => group_id member_id
 *   group_id => STRING
 *   member_id => STRING
 */

const requestProtocol = ({ groupId, memberId }) =>
  Object.assign(requestV1({ groupId, memberId }), { apiVersion: 2 });

export default requestProtocol;
