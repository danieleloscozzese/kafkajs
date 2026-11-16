import Encoder from "../../../encoder.mjs";
import apiKeys from "../../api_keys.mjs";
const { SaslAuthenticate: apiKey } = apiKeys;

/**
 * SaslAuthenticate Request (Version: 0) => sasl_auth_bytes
 *   sasl_auth_bytes => BYTES
 */

/**
 * @param {Buffer} authBytes - SASL authentication bytes from client as defined by the SASL mechanism
 */
const requestProtocol = ({ authBytes }) => ({
  apiKey,
  apiVersion: 0,
  apiName: "SaslAuthenticate",
  encode: async () => {
    return new Encoder().writeBuffer(authBytes);
  },
});

export default requestProtocol;
