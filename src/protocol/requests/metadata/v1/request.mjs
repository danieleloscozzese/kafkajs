import Encoder from "../../../encoder.mjs";
import apiKeys from "../../api_keys.mjs";
const { Metadata: apiKey } = apiKeys;

/**
 * Metadata Request (Version: 1) => [topics]
 *   topics => STRING
 */

const requestProtocol = ({ topics }) => ({
  apiKey,
  apiVersion: 1,
  apiName: "Metadata",
  encode: async () => {
    return new Encoder().writeNullableArray(topics);
  },
});

export default requestProtocol;
