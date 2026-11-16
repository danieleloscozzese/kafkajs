import Encoder from "../../../encoder.mjs";
import apiKeys from "../../api_keys.mjs";
const { DescribeGroups: apiKey } = apiKeys;

/**
 * DescribeGroups Request (Version: 0) => [group_ids]
 *   group_ids => STRING
 */

/**
 * @param {Array} groupIds List of groupIds to request metadata for (an empty groupId array will return empty group metadata)
 */
const requestProtocol = ({ groupIds }) => ({
  apiKey,
  apiVersion: 0,
  apiName: "DescribeGroups",
  encode: async () => {
    return new Encoder().writeArray(groupIds);
  },
});

export default requestProtocol;
