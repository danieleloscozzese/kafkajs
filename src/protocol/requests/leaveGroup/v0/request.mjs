import Encoder from "../../../encoder.mjs";
import apiKeys from "../../api_keys.mjs";
const { LeaveGroup: apiKey } = apiKeys;

/**
 * LeaveGroup Request (Version: 0) => group_id member_id
 *   group_id => STRING
 *   member_id => STRING
 */

const requestProtocol = ({ groupId, memberId }) => ({
  apiKey,
  apiVersion: 0,
  apiName: "LeaveGroup",
  encode: async () => {
    return new Encoder().writeString(groupId).writeString(memberId);
  },
});

export default requestProtocol;
