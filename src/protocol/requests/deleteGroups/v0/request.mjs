import Encoder from "../../../encoder.mjs";
import apiKeys from "../../api_keys.mjs";
const { DeleteGroups: apiKey } = apiKeys;

/**
 * DeleteGroups Request (Version: 0) => [groups_names]
 *   groups_names => STRING
 */

/**
 */
const requestProtocol = (groupIds) => ({
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

export default requestProtocol;
