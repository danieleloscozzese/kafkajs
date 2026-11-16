import Encoder from "../../../encoder.mjs";
import apiKeys from "../../api_keys.mjs";
const { SaslHandshake: apiKey } = apiKeys;

/**
 * SaslHandshake Request (Version: 0) => mechanism
 *    mechanism => STRING
 */

/**
 * @param {string} mechanism - SASL Mechanism chosen by the client
 */
const requestProtocol = ({ mechanism }) => ({
  apiKey,
  apiVersion: 0,
  apiName: "SaslHandshake",
  encode: async () => new Encoder().writeString(mechanism),
});

export default requestProtocol;
