const Encoder = require("../../../encoder.mjs").default;
const { DeleteTopics: apiKey } = require("../../api_keys.mjs").default;

/**
 * DeleteTopics Request (Version: 0) => [topics] timeout
 *   topics => STRING
 *   timeout => INT32
 */
module.exports = ({ topics, timeout = 5000 }) => ({
  apiKey,
  apiVersion: 0,
  apiName: "DeleteTopics",
  encode: async () => {
    return new Encoder().writeArray(topics).writeInt32(timeout);
  },
});
