const Encoder = require("../../../encoder.mjs").default;
const { DeleteGroups: apiKey } = require("../../api_keys.mjs").default;

/**
 * DeleteGroups Request (Version: 0) => [groups_names]
 *   groups_names => STRING
 */

/**
 */
module.exports = (groupIds) => ({
  apiKey,
  apiVersion: 0,
  apiName: "DeleteGroups",
  encode: async () => {
    return new Encoder().writeArray(groupIds.map(encodeGroups));
  },
});

const encodeGroups = (group) => {
  return new Encoder().writeString(group);
};
