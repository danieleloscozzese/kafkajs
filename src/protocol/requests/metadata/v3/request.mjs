import requestV1 from "../v1/request.mjs";
/**
 * Metadata Request (Version: 3) => [topics]
 *   topics => STRING
 */

const requestProtocol = ({ topics }) => Object.assign(requestV1({ topics }), { apiVersion: 3 });

export default requestProtocol;
