import Encoder from "../../../encoder.mjs";
import apiKeys from "../../api_keys.mjs";
const { ListGroups: apiKey } = apiKeys;

/**
 * ListGroups Request (Version: 0)
 */

/**
 */
const requestProtocol = () => ({
  apiKey,
  apiVersion: 0,
  apiName: "ListGroups",
  encode: async () => {
    return new Encoder();
  },
});

export default requestProtocol;
