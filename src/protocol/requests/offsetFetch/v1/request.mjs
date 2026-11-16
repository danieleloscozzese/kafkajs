import Encoder from "../../../encoder.mjs";
import apiKeys from "../../api_keys.mjs";
const { OffsetFetch: apiKey } = apiKeys;

/**
 * OffsetFetch Request (Version: 1) => group_id [topics]
 *   group_id => STRING
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition
 *       partition => INT32
 */

const requestProtocol = ({ groupId, topics }) => ({
  apiKey,
  apiVersion: 1,
  apiName: "OffsetFetch",
  encode: async () => {
    return new Encoder().writeString(groupId).writeArray(topics.map(encodeTopic));
  },
});

const encodeTopic = ({ topic, partitions }) => {
  return new Encoder().writeString(topic).writeArray(partitions.map(encodePartition));
};

const encodePartition = ({ partition }) => {
  return new Encoder().writeInt32(partition);
};

export default requestProtocol;
