import requestV0 from "../v0/request.mjs";
/**
 * ListGroups Request (Version: 1)
 */

const requestProtocol = () => Object.assign(requestV0(), { apiVersion: 1 });

export default requestProtocol;
