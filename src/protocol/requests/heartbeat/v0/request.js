const Encoder = require("../../../encoder.mjs").default;
const { Heartbeat: apiKey } = require("../../api_keys.mjs").default;

/**
 * Heartbeat Request (Version: 0) => group_id group_generation_id member_id
 *   group_id => STRING
 *   group_generation_id => INT32
 *   member_id => STRING
 */

module.exports = ({ groupId, groupGenerationId, memberId }) => ({
  apiKey,
  apiVersion: 0,
  apiName: "Heartbeat",
  encode: async () => {
    return new Encoder().writeString(groupId).writeInt32(groupGenerationId).writeString(memberId);
  },
});
