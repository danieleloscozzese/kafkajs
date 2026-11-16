import requestV0 from "../v0/request.mjs";
/**
 * SaslAuthenticate Request (Version: 1) => sasl_auth_bytes
 *   sasl_auth_bytes => BYTES
 */

/**
 * @param {Buffer} authBytes - SASL authentication bytes from client as defined by the SASL mechanism
 */
const requestProtocol = ({ authBytes }) =>
  Object.assign(requestV0({ authBytes }), { apiVersion: 1 });

export default requestProtocol;
