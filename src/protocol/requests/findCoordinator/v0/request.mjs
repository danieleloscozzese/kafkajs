import Encoder from "../../../encoder.mjs";
import apiKeys from "../../api_keys.mjs";
const { GroupCoordinator: apiKey } = apiKeys;

/**
 * FindCoordinator Request (Version: 0) => group_id
 *   group_id => STRING
 */

const requestProtocol = ({ groupId }) => ({
  apiKey,
  apiVersion: 0,
  apiName: "GroupCoordinator",
  encode: async () => {
    return new Encoder().writeString(groupId);
  },
});

export default requestProtocol;
