import requestV0 from "../v0/request.mjs";
/**
 * DescribeGroups Request (Version: 1) => [group_ids]
 *   group_ids => STRING
 */

const requestProtocol = ({ groupIds }) => Object.assign(requestV0({ groupIds }), { apiVersion: 1 });

export default requestProtocol;
