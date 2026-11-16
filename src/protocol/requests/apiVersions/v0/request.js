const Encoder = require("../../../encoder.mjs").default;
const { ApiVersions: apiKey } = require("../../apiKeys");

/**
 * ApiVersionRequest => ApiKeys
 */

module.exports = () => ({
  apiKey,
  apiVersion: 0,
  apiName: "ApiVersions",
  encode: async () => new Encoder(),
});
