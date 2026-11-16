import Encoder from "../../../encoder.mjs";
import apiKeys from "../../api_keys.mjs";
const { Metadata: apiKey } = apiKeys;

/**
 * Metadata Request (Version: 4) => [topics] allow_auto_topic_creation
 *   topics => STRING
 *   allow_auto_topic_creation => BOOLEAN
 */

const requestProtocol = ({ topics, allowAutoTopicCreation = true }) => ({
  apiKey,
  apiVersion: 4,
  apiName: "Metadata",
  encode: async () => {
    return new Encoder().writeNullableArray(topics).writeBoolean(allowAutoTopicCreation);
  },
});

export default requestProtocol;
