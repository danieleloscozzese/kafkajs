import Encoder from "../../../encoder.mjs";
import apiKeys from "../../api_keys.mjs";
const { Heartbeat: apiKey } = apiKeys;

/**
 * Heartbeat Request (Version: 0) => group_id group_generation_id member_id
 *   group_id => STRING
 *   group_generation_id => INT32
 *   member_id => STRING
 */

const requestProtocol = ({ groupId, groupGenerationId, memberId }) => ({
  apiKey,
  apiVersion: 0,
  apiName: "Heartbeat",
  encode: async () => {
    return new Encoder().writeString(groupId).writeInt32(groupGenerationId).writeString(memberId);
  },
});

export default requestProtocol;
