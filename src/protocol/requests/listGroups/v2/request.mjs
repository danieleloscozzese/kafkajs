import requestV1 from "../v1/request.mjs";
/**
 * ListGroups Request (Version: 2)
 */

const requestProtocol = () => Object.assign(requestV1(), { apiVersion: 2 });

export default requestProtocol;
