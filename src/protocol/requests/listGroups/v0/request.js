const Encoder = require("../../../encoder.mjs").default;
const { ListGroups: apiKey } = require("../../api_keys.mjs").default;

/**
 * ListGroups Request (Version: 0)
 */

/**
 */
module.exports = () => ({
  apiKey,
  apiVersion: 0,
  apiName: "ListGroups",
  encode: async () => {
    return new Encoder();
  },
});
