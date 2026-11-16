import Encoder from "../../../encoder.mjs";
import apiKeys from "../../api_keys.mjs";
const { GroupCoordinator: apiKey } = apiKeys;

/**
 * FindCoordinator Request (Version: 1) => coordinator_key coordinator_type
 *   coordinator_key => STRING
 *   coordinator_type => INT8
 */

const requestProtocol = ({ coordinatorKey, coordinatorType }) => ({
  apiKey,
  apiVersion: 1,
  apiName: "GroupCoordinator",
  encode: async () => {
    return new Encoder().writeString(coordinatorKey).writeInt8(coordinatorType);
  },
});

export default requestProtocol;
