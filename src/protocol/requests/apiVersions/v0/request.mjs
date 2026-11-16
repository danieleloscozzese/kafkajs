import Encoder from "../../../encoder.mjs";
import apiKeys from "../../api_keys.mjs";
const { ApiVersions: apiKey } = apiKeys;

/**
 * ApiVersionRequest => ApiKeys
 */

const requestProtocol = () => ({
  apiKey,
  apiVersion: 0,
  apiName: "ApiVersions",
  encode: async () => new Encoder(),
});

export default requestProtocol;
