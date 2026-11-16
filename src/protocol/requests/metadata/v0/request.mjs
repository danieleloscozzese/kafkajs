import Encoder from "../../../encoder.mjs";
import apiKeys from "../../api_keys.mjs";
const { Metadata: apiKey } = apiKeys;

/**
 * Metadata Request (Version: 0) => [topics]
 *   topics => STRING
 */

const requestProtocol = ({ topics }) => ({
  apiKey,
  apiVersion: 0,
  apiName: "Metadata",
  encode: async () => {
    return new Encoder().writeArray(topics);
  },
});

export default requestProtocol;
