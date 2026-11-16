import requestV0 from "../v0/request.mjs";
/**
 * DeleteTopics Request (Version: 1) => [topics] timeout
 *   topics => STRING
 *   timeout => INT32
 */

const requestProtocol = ({ topics, timeout }) =>
  Object.assign(requestV0({ topics, timeout }), { apiVersion: 1 });

export default requestProtocol;
