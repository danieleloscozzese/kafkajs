import requestV0 from "../v0/request.mjs";
/**
 * DeleteGroups Request (Version: 1)
 */

const requestProtocol = (groupIds) => Object.assign(requestV0(groupIds), { apiVersion: 1 });

export default requestProtocol;
