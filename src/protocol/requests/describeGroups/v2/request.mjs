import requestV1 from "../v1/request.mjs";
/**
 * DescribeGroups Request (Version: 2) => [group_ids]
 *   group_ids => STRING
 */

const requestProtocol = ({ groupIds }) => Object.assign(requestV1({ groupIds }), { apiVersion: 2 });

export default requestProtocol;
