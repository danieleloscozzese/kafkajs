import requestV1 from "../v1/request.mjs";
/**
 * Metadata Request (Version: 2) => [topics]
 *   topics => STRING
 */

const requestProtocol = ({ topics }) => Object.assign(requestV1({ topics }), { apiVersion: 2 });

export default requestProtocol;
