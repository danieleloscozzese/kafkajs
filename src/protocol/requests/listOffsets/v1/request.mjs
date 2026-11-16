import Encoder from "../../../encoder.mjs";
import apiKeysModule from "../../api_keys.mjs";
const { ListOffsets: apiKey } = apiKeysModule;

/**
 * ListOffsets Request (Version: 1) => replica_id [topics]
 *   replica_id => INT32
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition timestamp
 *       partition => INT32
 *       timestamp => INT64
 */
const requestProtocol = ({ replicaId, topics }) => ({
  apiKey,
  apiVersion: 1,
  apiName: "ListOffsets",
  encode: async () => {
    return new Encoder().writeInt32(replicaId).writeArray(topics.map(encodeTopic));
  },
});

const encodeTopic = ({ topic, partitions }) => {
  return new Encoder().writeString(topic).writeArray(partitions.map(encodePartition));
};

const encodePartition = ({ partition, timestamp = -1 }) => {
  return new Encoder().writeInt32(partition).writeInt64(timestamp);
};

export default requestProtocol;
