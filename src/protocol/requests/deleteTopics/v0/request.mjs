import Encoder from "../../../encoder.mjs";
import apiKeys from "../../api_keys.mjs";
const { DeleteTopics: apiKey } = apiKeys;

/**
 * DeleteTopics Request (Version: 0) => [topics] timeout
 *   topics => STRING
 *   timeout => INT32
 */
const requestProtocol = ({ topics, timeout = 5000 }) => ({
  apiKey,
  apiVersion: 0,
  apiName: "DeleteTopics",
  encode: async () => {
    return new Encoder().writeArray(topics).writeInt32(timeout);
  },
});

export default requestProtocol;
